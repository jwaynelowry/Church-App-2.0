import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useChurchRole(churchId) {
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRole() {
      if (!user?.uid || !churchId) {
        setLoading(false);
        return;
      }

      try {
        const memberDoc = await getDoc(doc(db, 'churches', churchId, 'members', user.uid));
        if (memberDoc.exists()) {
          const memberData = memberDoc.data();
          setRole(memberData.role);

          // Fetch role permissions
          const roleDoc = await getDoc(doc(db, 'churches', churchId, 'roles', memberData.role));
          if (roleDoc.exists()) {
            setPermissions(roleDoc.data().permissions);
          }
        }
      } catch (error) {
        console.error('Error fetching church role:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [churchId, user?.uid]);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return {
    role,
    permissions,
    hasPermission,
    loading
  };
}