import { useState, useEffect } from 'react';
import { 
  doc, 
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useChurch(churchId) {
  const [church, setChurch] = useState(null);
  const [members, setMembers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!churchId) return;

    const unsubscribes = [];

    // Church details listener
    const churchUnsubscribe = onSnapshot(
      doc(db, 'churches', churchId),
      async (doc) => {
        if (doc.exists()) {
          // Get followers count
          const followersQuery = query(
            collection(db, 'users'),
            where('followingChurches', 'array-contains', churchId)
          );
          const followersSnapshot = await getDocs(followersQuery);
          
          setChurch({ 
            id: doc.id, 
            ...doc.data(),
            followersCount: followersSnapshot.size
          });
        } else {
          setError('Church not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching church:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    unsubscribes.push(churchUnsubscribe);

    // Followers listener
    const followersUnsubscribe = onSnapshot(
      query(
        collection(db, 'users'),
        where('followingChurches', 'array-contains', churchId),
        limit(10)
      ),
      (snapshot) => {
        setFollowers(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );
    unsubscribes.push(followersUnsubscribe);

    // Members listener
    const membersUnsubscribe = onSnapshot(
      query(collection(db, 'churches', churchId, 'members')),
      (snapshot) => {
        setMembers(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );
    unsubscribes.push(membersUnsubscribe);

    // Events listener
    const eventsUnsubscribe = onSnapshot(
      query(
        collection(db, 'churches', churchId, 'events'),
        orderBy('date', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        setEvents(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );
    unsubscribes.push(eventsUnsubscribe);

    // Posts listener
    const postsUnsubscribe = onSnapshot(
      query(
        collection(db, 'churches', churchId, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      }
    );
    unsubscribes.push(postsUnsubscribe);

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [churchId]);

  const followChurch = async () => {
    if (!user?.uid || !churchId) return { error: 'Unauthorized' };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        followingChurches: arrayUnion(churchId),
        updatedAt: serverTimestamp()
      });

      // Log activity
      await addDoc(collection(db, 'activityLogs'), {
        userId: user.uid,
        churchId,
        action: 'FOLLOW_CHURCH',
        timestamp: serverTimestamp()
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const unfollowChurch = async () => {
    if (!user?.uid || !churchId) return { error: 'Unauthorized' };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        followingChurches: arrayRemove(churchId),
        updatedAt: serverTimestamp()
      });

      // Log activity
      await addDoc(collection(db, 'activityLogs'), {
        userId: user.uid,
        churchId,
        action: 'UNFOLLOW_CHURCH',
        timestamp: serverTimestamp()
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    church,
    members,
    followers,
    events,
    posts,
    loading,
    error,
    followChurch,
    unfollowChurch
  };
}