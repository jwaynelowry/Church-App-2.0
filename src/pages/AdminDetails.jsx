import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { Badge } from '../components/Badge';
import { 
  UserCog, 
  Mail, 
  Phone, 
  Calendar,
  ArrowLeft,
  Clock,
  Activity
} from 'lucide-react';

export function AdminDetails() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { admin, loading, error } = useAdmin(adminId);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
        <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Error loading admin details: {error}</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Admin not found</h2>
        <button
          onClick={() => navigate('/dashboard/admin/admins')}
          className="mt-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/admin/admins')}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <Badge
          variant={admin.isOnline ? 'success' : 'gray'}
          className="capitalize"
        >
          {admin.isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
}