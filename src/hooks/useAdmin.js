import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useAdmin(adminId) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'users', adminId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setAdmin({
            id: doc.id,
            ...data,
            isOnline: data.lastActive ? 
              new Date().getTime() - data.lastActive.toDate().getTime() < 5 * 60 * 1000 : false
          });
        } else {
          setError('Admin not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching admin:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [adminId]);

  return { admin, loading, error };
}