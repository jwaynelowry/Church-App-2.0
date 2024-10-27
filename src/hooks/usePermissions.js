import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

// Define permission constants
export const PERMISSIONS = {
  // Church permissions
  MANAGE_CHURCH: 'manage:church',
  VIEW_CHURCH: 'view:church',
  EDIT_CHURCH: 'edit:church',
  DELETE_CHURCH: 'delete:church',
  
  // Member permissions
  MANAGE_MEMBERS: 'manage:members',
  VIEW_MEMBERS: 'view:members',
  ADD_MEMBERS: 'add:members',
  REMOVE_MEMBERS: 'remove:members',
  
  // Event permissions
  MANAGE_EVENTS: 'manage:events',
  VIEW_EVENTS: 'view:events',
  CREATE_EVENTS: 'create:events',
  EDIT_EVENTS: 'edit:events',
  DELETE_EVENTS: 'delete:events',
  
  // Post permissions
  MANAGE_POSTS: 'manage:posts',
  VIEW_POSTS: 'view:posts',
  CREATE_POSTS: 'create:posts',
  EDIT_POSTS: 'edit:posts',
  DELETE_POSTS: 'delete:posts',
  
  // Admin permissions
  MANAGE_ADMINS: 'manage:admins',
  VIEW_ADMINS: 'view:admins',
  CREATE_ADMINS: 'create:admins',
  EDIT_ADMINS: 'edit:admins',
  DELETE_ADMINS: 'delete:admins',
  
  // System permissions
  MANAGE_SYSTEM: 'manage:system',
  VIEW_ANALYTICS: 'view:analytics',
  RUN_MIGRATIONS: 'run:migrations',
  MODERATE_CONTENT: 'moderate:content'
};

// Define role permission sets
export const ROLE_PERMISSIONS = {
  superadmin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.VIEW_CHURCH,
    PERMISSIONS.EDIT_CHURCH,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_POSTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MODERATE_CONTENT
  ],
  church_admin: [
    PERMISSIONS.VIEW_CHURCH,
    PERMISSIONS.EDIT_CHURCH,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_POSTS
  ],
  moderator: [
    PERMISSIONS.VIEW_CHURCH,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.VIEW_POSTS,
    PERMISSIONS.MODERATE_CONTENT
  ],
  member: [
    PERMISSIONS.VIEW_CHURCH,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.VIEW_POSTS,
    PERMISSIONS.CREATE_POSTS
  ]
};

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        // Get base permissions from role
        let userPermissions = [];

        // System admin permissions
        if (user.role === 'superadmin') {
          userPermissions = ROLE_PERMISSIONS.superadmin;
        } else if (user.role === 'admin') {
          userPermissions = ROLE_PERMISSIONS.admin;
        } else {
          // Regular user permissions
          userPermissions = ROLE_PERMISSIONS.member;

          // Add church-specific permissions
          if (user.churchRoles) {
            for (const [churchId, role] of Object.entries(user.churchRoles)) {
              const churchRoleDoc = await getDoc(doc(db, 'churches', churchId, 'roles', role));
              if (churchRoleDoc.exists()) {
                userPermissions = [...userPermissions, ...churchRoleDoc.data().permissions];
              }
            }
          }
        }

        // Remove duplicates
        setPermissions([...new Set(userPermissions)]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading permissions:', error);
        setLoading(false);
      }
    }

    loadPermissions();
  }, [user]);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (requiredPermissions) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading
  };
}