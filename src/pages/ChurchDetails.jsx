import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChurch } from '../hooks/useChurch';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  Church,
  Mail, 
  Phone, 
  Calendar,
  ArrowLeft,
  MapPin,
  Users,
  Activity,
  Heart,
  UserPlus
} from 'lucide-react';

export function ChurchDetails() {
  const { churchId } = useParams();
  const navigate = useNavigate();
  const { church, followers, loading, error } = useChurch(churchId);
  const { user } = useAuth();

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
        <p className="text-red-700">Error loading church details: {error}</p>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Church not found</h2>
        <button
          onClick={() => navigate('/dashboard/admin/churches')}
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
          onClick={() => navigate('/dashboard/admin/churches')}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <Badge
          variant={church.status === 'active' ? 'success' : 'gray'}
          className="capitalize"
        >
          {church.status}
        </Badge>
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
}