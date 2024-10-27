import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChurches } from '../hooks/useChurches';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/Badge';
import { Church, MapPin, Users, Heart, Search } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function UserChurches() {
  const navigate = useNavigate();
  const { churches, loading, error } = useChurches();
  const { user, followChurch, unfollowChurch } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChurches = churches.filter(church => 
    church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFollowToggle = async (e, churchId) => {
    e.stopPropagation(); // Prevent card click when clicking follow button
    if (user?.followingChurches?.includes(churchId)) {
      await unfollowChurch(churchId);
    } else {
      await followChurch(churchId);
    }
  };

  const handleChurchClick = (churchId) => {
    navigate(`/dashboard/churches/${churchId}/profile`);
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Error loading churches: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Discover Churches</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find and follow churches in your community
        </p>
      </div>

      <div className="max-w-md">
        <Input
          icon={Search}
          type="text"
          placeholder="Search churches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          filteredChurches.map((church) => (
            <div 
              key={church.id}
              onClick={() => handleChurchClick(church.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Church className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {church.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {church.address}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={church.status === 'active' ? 'success' : 'gray'}
                    className="capitalize"
                  >
                    {church.status}
                  </Badge>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{church.memberCount || 0} members</span>
                </div>

                <Button
                  onClick={(e) => handleFollowToggle(e, church.id)}
                  className={`w-full !inline-flex items-center justify-center ${
                    user?.followingChurches?.includes(church.id)
                      ? '!bg-red-50 !text-red-600 hover:!bg-red-100'
                      : '!bg-indigo-50 !text-indigo-600 hover:!bg-indigo-100'
                  }`}
                >
                  <Heart 
                    className={`h-4 w-4 mr-2 ${
                      user?.followingChurches?.includes(church.id) ? 'fill-current' : ''
                    }`} 
                  />
                  {user?.followingChurches?.includes(church.id) ? 'Unfollow' : 'Follow'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && filteredChurches.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Church className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No churches found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Check back later for new churches'}
          </p>
        </div>
      )}
    </div>
  );
}