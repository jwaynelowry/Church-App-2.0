import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useActivity(churchId = null) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let activityQuery;
    if (churchId) {
      // Church-specific activities
      activityQuery = query(
        collection(db, 'activityLogs'),
        where('churchId', '==', churchId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    } else if (user.role === 'admin') {
      // All activities for admins
      activityQuery = query(
        collection(db, 'activityLogs'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    } else {
      // User's activities
      activityQuery = query(
        collection(db, 'activityLogs'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [churchId, user]);

  const logActivity = async (action, details = {}) => {
    if (!user?.uid) return;

    try {
      await addDoc(collection(db, 'activityLogs'), {
        userId: user.uid,
        churchId: churchId || null,
        action,
        details,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return {
    activities,
    loading,
    logActivity
  };
}