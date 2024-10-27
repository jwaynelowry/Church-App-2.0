import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PERMISSIONS } from './usePermissions';

export function useRoles(churchId) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRoles() {
      if (!churchId) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const rolesQuery = query(collection(db, 'churches', churchId, 'roles'));
        const snapshot = await getDocs(rolesQuery);
        
        setRoles(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setLoading(false);
      } catch (err) {
        console.error('Error loading roles:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadRoles();
  }, [churchId]);

  const createRole = async (roleName, permissions) => {
    if (!churchId) throw new Error('Church ID is required');

    try {
      const roleRef = await addDoc(collection(db, 'churches', churchId, 'roles'), {
        name: roleName,
        permissions: permissions,
        createdAt: new Date().toISOString()
      });

      return { id: roleRef.id, name: roleName, permissions };
    } catch (err) {
      throw new Error(`Failed to create role: ${err.message}`);
    }
  };

  const updateRole = async (roleId, updates) => {
    if (!churchId || !roleId) throw new Error('Church ID and Role ID are required');

    try {
      const roleRef = doc(db, 'churches', churchId, 'roles', roleId);
      await updateDoc(roleRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      throw new Error(`Failed to update role: ${err.message}`);
    }
  };

  const deleteRole = async (roleId) => {
    if (!churchId || !roleId) throw new Error('Church ID and Role ID are required');

    try {
      await deleteDoc(doc(db, 'churches', churchId, 'roles', roleId));
    } catch (err) {
      throw new Error(`Failed to delete role: ${err.message}`);
    }
  };

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole
  };
}