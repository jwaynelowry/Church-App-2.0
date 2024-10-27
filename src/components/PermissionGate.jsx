import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

export function PermissionGate({ 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null 
}) {
  const { hasAllPermissions, hasAnyPermission, loading } = usePermissions();

  if (loading) {
    return null;
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasAccess ? children : fallback;
}