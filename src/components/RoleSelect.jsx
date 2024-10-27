import React from 'react';
import { useRoles } from '../hooks/useRoles';

export function RoleSelect({ 
  churchId, 
  value, 
  onChange, 
  className = '', 
  disabled = false 
}) {
  const { roles, loading, error } = useRoles(churchId);

  if (loading) {
    return (
      <select 
        disabled 
        className={`animate-pulse bg-gray-100 border border-gray-300 rounded-md ${className}`}
      >
        <option>Loading roles...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select 
        disabled 
        className={`bg-red-50 border border-red-300 rounded-md ${className}`}
      >
        <option>Error loading roles</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    >
      <option value="">Select a role</option>
      {roles.map(role => (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
  );
}