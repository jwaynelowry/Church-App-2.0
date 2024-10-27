import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFeed } from '../hooks/useFeed';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Clock,
  Church,
  Users
} from 'lucide-react';

export function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, loading, error } = useFeed();
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Error loading feed: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Feed</h1>
          <p className="mt-1 text-sm text-gray-500">
            Updates from churches you follow
          </p>
        </div>
        {user?.followingChurches?.length === 0 && (
          <Button
            onClick={() => navigate('/dashboard/churches')}
            className="!inline-flex !w-auto items-center"
          >
            <Church className="h-4 w-4 mr-2" />
            Find Churches
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">
            Follow churches to see their updates in your feed
          </p>
          <Button
            onClick={() => navigate('/dashboard/churches')}
            className="!inline-flex items-center"
          >
            <Church className="h-4 w-4 mr-2" />
            Discover Churches
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {/* Church Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Church className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {post.churchName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <p className={`text-gray-800 ${
                    expandedPosts.has(post.id) ? '' : 'line-clamp-3'
                  }`}>
                    {post.content}
                  </p>
                  {post.content.length > 150 && (
                    <button
                      onClick={() => togglePostExpansion(post.id)}
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      {expandedPosts.has(post.id) ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Post Media */}
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt="Post attachment" 
                    className="mt-4 rounded-lg w-full object-cover max-h-96"
                  />
                )}

                {/* Post Actions */}
                <div className="mt-4 flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-indigo-600">
                      <Heart className="h-5 w-5 mr-1" />
                      <span className="text-sm">{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-indigo-600">
                      <MessageSquare className="h-5 w-5 mr-1" />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-indigo-600">
                      <Share2 className="h-5 w-5 mr-1" />
                    </button>
                  </div>
                  {post.tags?.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="gray">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}