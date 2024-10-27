import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../lib/firebase';

// Create a secondary app for admin creation
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

export function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role === 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    const adminsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'admin')
    );

    try {
      const unsubscribe = onSnapshot(adminsQuery, (snapshot) => {
        const adminsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isOnline: doc.data().lastActive ? 
            new Date().getTime() - doc.data().lastActive.toDate().getTime() < 5 * 60 * 1000 : false
        }));

        setAdmins(adminsList);
        setLoading(false);
      });

      // Update current user's lastActive timestamp every minute
      const intervalId = setInterval(async () => {
        if (user?.uid) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            lastActive: serverTimestamp()
          });
        }
      }, 60000);

      // Update lastActive on mount
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        updateDoc(userRef, {
          lastActive: serverTimestamp()
        });
      }

      return () => {
        unsubscribe();
        clearInterval(intervalId);
      };
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  const createAdmin = async (adminData) => {
    try {
      // Check if email already exists
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', adminData.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        throw new Error('Email already exists');
      }

      // Create new admin account using secondary app
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        adminData.email,
        adminData.password
      );

      // Create user document for new admin
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone || null,
        role: 'admin',
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });

      // Sign out from secondary app
      await secondaryAuth.signOut();

      return userCredential.user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  };

  return { admins, loading, error, createAdmin };
}