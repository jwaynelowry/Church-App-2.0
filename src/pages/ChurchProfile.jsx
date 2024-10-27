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
  MessageSquare,
  Clock
} from 'lucide-react';

export function ChurchProfile() {
  const { churchId } = useParams();
  const navigate = useNavigate();
  const { church, events, posts, loading, error } = useChurch(churchId);
  const { user, followChurch, unfollowChurch } = useAuth();

  const isFollowing = user?.followingChurches?.includes(churchId);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowChurch(churchId);
    } else {
      await followChurch(churchId);
    }
  };

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
        <p className="text-red-700">Error loading church profile: {error}</p>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Church not found</h2>
        <button
          onClick={() => navigate('/dashboard/churches')}
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
          onClick={() => navigate('/dashboard/churches')}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleFollowToggle}
            className={`!inline-flex !w-auto items-center ${
              isFollowing 
                ? '!bg-red-50 !text-red-600 hover:!bg-red-100'
                : '!bg-indigo-50 !text-indigo-600 hover:!bg-indigo-100'
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          <Badge
            variant={church.status === 'active' ? 'success' : 'gray'}
            className="capitalize"
          >
            {church.status}
          </Badge>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <Church className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{church.name}</h2>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {church.address}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{church.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{church.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3" />
                  <span>{church.memberCount || 0} members</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Activity className="h-5 w-5 mr-3" />
                  <span>Capacity: {church.capacity}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                {events?.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {events?.length === 0 && (
                  <p className="text-sm text-gray-500">No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Posts</h3>
          <div className="space-y-6">
            {posts?.slice(0, 3).map(post => (
              <div key={post.id} className="space-y-2">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-900">{post.content}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {posts?.length === 0 && (
              <p className="text-sm text-gray-500">No recent posts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}