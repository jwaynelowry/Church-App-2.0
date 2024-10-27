import React from 'react';
import { PERMISSIONS } from '../hooks/usePermissions';

export function PermissionsList({ 
  selectedPermissions = [], 
  onTogglePermission,
  disabled = false 
}) {
  const permissionGroups = {
    Church: Object.entries(PERMISSIONS)
      .filter(([key]) => key.startsWith('MANAGE_CHURCH') || key.startsWith('VIEW_CHURCH') || key.startsWith('EDIT_CHURCH')),
    Members: Object.entries(PERMISSIONS)
      .filter(([key]) => key.includes('MEMBER')),
    Events: Object.entries(PERMISSIONS)
      .filter(([key]) => key.includes('EVENT')),
    Posts: Object.entries(PERMISSIONS)
      .filter(([key]) => key.includes('POST')),
    Admin: Object.entries(PERMISSIONS)
      .filter(([key]) => key.includes('ADMIN')),
    System: Object.entries(PERMISSIONS)
      .filter(([key]) => key.startsWith('MANAGE_SYSTEM') || key.startsWith('VIEW_') || key.startsWith('RUN_') || key.startsWith('MODERATE_'))
  };

  return (
    <div className="space-y-6">
      {Object.entries(permissionGroups).map(([groupName, permissions]) => (
        <div key={groupName}>
          <h3 className="text-sm font-medium text-gray-900 mb-2">{groupName}</h3>
          <div className="space-y-2">
            {permissions.map(([key, value]) => (
              <label 
                key={key} 
                className={`flex items-center space-x-3 ${disabled ? 'opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(value)}
                  onChange={() => onTogglePermission(value)}
                  disabled={disabled}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  {key.split('_').join(' ').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}