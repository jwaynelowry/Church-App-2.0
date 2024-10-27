import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot,
  serverTimestamp,
  addDoc,
  getDocs,
  where,
  doc,
  setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../lib/firebase';

// Create a secondary app for church account creation
const secondaryApp = initializeApp(firebaseConfig, 'ChurchRegistration');
const secondaryAuth = getAuth(secondaryApp);

export function useChurches() {
  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role === 'admin') {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    const churchesQuery = query(collection(db, 'churches'));

    try {
      const unsubscribe = onSnapshot(churchesQuery, async (snapshot) => {
        const churchesList = [];
        
        for (const doc of snapshot.docs) {
          // Get member count for each church
          const membersQuery = query(
            collection(db, 'users'),
            where('churchId', '==', doc.id)
          );
          const membersSnapshot = await getDocs(membersQuery);
          
          churchesList.push({
            id: doc.id,
            ...doc.data(),
            memberCount: membersSnapshot.size
          });
        }

        setChurches(churchesList);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error fetching churches:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  const createChurch = async (churchData) => {
    try {
      // Check if church with same name exists
      const nameQuery = query(
        collection(db, 'churches'),
        where('name', '==', churchData.name)
      );
      const nameSnapshot = await getDocs(nameQuery);
      if (!nameSnapshot.empty) {
        throw new Error('Church with this name already exists');
      }

      // Check if email is already in use
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', churchData.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        throw new Error('Email already in use');
      }

      // Create church user account
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        churchData.email,
        churchData.password
      );

      // Create church document
      const churchRef = await addDoc(collection(db, 'churches'), {
        name: churchData.name,
        address: churchData.address,
        phone: churchData.phone,
        email: churchData.email,
        capacity: parseInt(churchData.capacity),
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        adminId: userCredential.user.uid
      });

      // Create user document for church account
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: churchData.name,
        lastName: 'Church',
        email: churchData.email,
        phone: churchData.phone,
        role: 'church',
        churchId: churchRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        settings: {
          notifications: true
        }
      });

      // Sign out from secondary app
      await secondaryAuth.signOut();

      return { church: churchRef, user: userCredential.user };
    } catch (error) {
      console.error('Error creating church:', error);
      throw error;
    }
  };

  return { churches, loading, error, createChurch };
}