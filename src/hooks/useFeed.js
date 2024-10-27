import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid || !user?.followingChurches?.length) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const postsQuery = query(
      collection(db, 'posts'),
      where('churchId', 'in', user.followingChurches),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    try {
      const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
        const postsData = [];
        
        for (const doc of snapshot.docs) {
          const postData = doc.data();
          
          // Get church details
          const churchDoc = await getDocs(doc(db, 'churches', postData.churchId));
          const churchData = churchDoc.data();
          
          postsData.push({
            id: doc.id,
            ...postData,
            churchName: churchData?.name || 'Unknown Church'
          });
        }
        
        setPosts(postsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error fetching feed:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [user]);

  return { posts, loading, error };
}