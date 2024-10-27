import { useState, useEffect } from 'react';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChurches: 0,
    totalAdmins: 0,
    recentActivity: 0,
    userGrowth: 0,
    churchGrowth: 0,
    adminGrowth: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        // Get current date and last month's date
        const now = Timestamp.now();
        const lastMonth = Timestamp.fromDate(
          new Date(now.toDate().setMonth(now.toDate().getMonth() - 1))
        );

        // Fetch users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt instanceof Timestamp ? 
            doc.data().createdAt : 
            Timestamp.fromDate(new Date(doc.data().createdAt))
        }));

        // Fetch churches
        const churchesSnapshot = await getDocs(collection(db, 'churches'));
        const churches = churchesSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt instanceof Timestamp ? 
            doc.data().createdAt : 
            Timestamp.fromDate(new Date(doc.data().createdAt))
        }));

        // Calculate stats
        const regularUsers = users.filter(user => user.role === 'user');
        const adminUsers = users.filter(user => user.role === 'admin');
        
        const newUsers = regularUsers.filter(user => user.createdAt > lastMonth);
        const newChurches = churches.filter(church => church.createdAt > lastMonth);
        const newAdmins = adminUsers.filter(admin => admin.createdAt > lastMonth);

        const last24Hours = Timestamp.fromDate(
          new Date(now.toDate().getTime() - (24 * 60 * 60 * 1000))
        );
        
        const recentActivity = [...users, ...churches].filter(
          item => item.createdAt > last24Hours
        ).length;

        if (isMounted) {
          setStats({
            totalUsers: regularUsers.length,
            totalChurches: churches.length,
            totalAdmins: adminUsers.length,
            recentActivity,
            userGrowth: regularUsers.length ? (newUsers.length / regularUsers.length) * 100 : 0,
            churchGrowth: churches.length ? (newChurches.length / churches.length) * 100 : 0,
            adminGrowth: adminUsers.length ? (newAdmins.length / adminUsers.length) * 100 : 0,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (isMounted) {
          setStats(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load statistics'
          }));
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
}