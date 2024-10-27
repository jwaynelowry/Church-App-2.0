import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          await updateDoc(doc(db, 'users', user.uid), {
            lastActive: serverTimestamp()
          });
          setUser({ ...user, ...userDoc.data() });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const followChurch = async (churchId) => {
    if (!user?.uid) return { error: 'No user logged in' };

    try {
      // Update local state immediately
      setUser(currentUser => ({
        ...currentUser,
        followingChurches: [...(currentUser.followingChurches || []), churchId]
      }));

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        followingChurches: [...(user.followingChurches || []), churchId],
        updatedAt: serverTimestamp()
      });

      return { error: null };
    } catch (error) {
      // Revert local state if update fails
      setUser(currentUser => ({
        ...currentUser,
        followingChurches: currentUser.followingChurches.filter(id => id !== churchId)
      }));
      return { error };
    }
  };

  const unfollowChurch = async (churchId) => {
    if (!user?.uid) return { error: 'No user logged in' };

    try {
      // Update local state immediately
      setUser(currentUser => ({
        ...currentUser,
        followingChurches: currentUser.followingChurches.filter(id => id !== churchId)
      }));

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        followingChurches: user.followingChurches.filter(id => id !== churchId),
        updatedAt: serverTimestamp()
      });

      return { error: null };
    } catch (error) {
      // Revert local state if update fails
      setUser(currentUser => ({
        ...currentUser,
        followingChurches: [...(currentUser.followingChurches || []), churchId]
      }));
      return { error };
    }
  };

  // Rest of the code remains the same...
  const signUp = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        role: 'user',
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        followingChurches: [],
        churchRoles: {},
        settings: {
          notifications: true
        }
      });

      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signOutUser = async () => {
    try {
      if (user?.uid) {
        await updateDoc(doc(db, 'users', user.uid), {
          lastActive: serverTimestamp()
        });
      }
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (!user?.email) return { error: 'No user logged in' };

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user?.uid) return { error: 'No user logged in' };

    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updatedData);
      
      // Update local user state immediately
      setUser(currentUser => ({
        ...currentUser,
        ...updates
      }));
      
      // Fetch fresh user data to ensure consistency
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(currentUser => ({
          ...currentUser,
          ...userDoc.data()
        }));
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    updatePassword,
    updateUserProfile,
    followChurch,
    unfollowChurch
  };
}