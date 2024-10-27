import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Bell,
  Shield,
  MessageSquare,
  Calendar,
  Church
} from 'lucide-react';

export function Profile() {
  const { user, updateUserProfile, updatePassword } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.settings?.emailNotifications ?? true,
    churchUpdates: user?.settings?.churchUpdates ?? true,
    eventReminders: user?.settings?.eventReminders ?? true,
    prayerRequests: user?.settings?.prayerRequests ?? true,
    communityPosts: user?.settings?.communityPosts ?? true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleOpenEditModal = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenNotificationModal = () => {
    setNotificationSettings({
      emailNotifications: user?.settings?.emailNotifications ?? true,
      churchUpdates: user?.settings?.churchUpdates ?? true,
      eventReminders: user?.settings?.eventReminders ?? true,
      prayerRequests: user?.settings?.prayerRequests ?? true,
      communityPosts: user?.settings?.communityPosts ?? true
    });
    setIsNotificationModalOpen(true);
  };

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { id, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone
      });
      setSuccess('Profile updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({
        settings: notificationSettings
      });
      setSuccess('Notification settings updated successfully');
      setIsNotificationModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully');
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
        <Badge variant={user?.role === 'admin' ? 'success' : 'gray'} className="capitalize">
          {user?.role}
        </Badge>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3" />
                    <span>{user?.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Shield className="h-5 w-5 mr-3" />
                  <span className="capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Bell className="h-5 w-5 mr-3" />
                  <span>
                    Email Notifications: {user?.settings?.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleOpenEditModal}
                  className="w-full"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={handleOpenNotificationModal}
                  className="w-full !bg-indigo-50 !text-indigo-700 hover:!bg-indigo-100"
                >
                  Notification Settings
                </Button>
                <Button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full !bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              id="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Last Name"
              id="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              required
            />
          </div>
          <Input
            label="Phone"
            type="tel"
            id="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
          />
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="Notification Settings"
      >
        <form onSubmit={handleNotificationSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Email Notifications</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="churchUpdates"
                checked={notificationSettings.churchUpdates}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                <Church className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Church Updates</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="eventReminders"
                checked={notificationSettings.eventReminders}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Event Reminders</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="prayerRequests"
                checked={notificationSettings.prayerRequests}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Prayer Requests</span>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="communityPosts"
                checked={notificationSettings.communityPosts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Community Posts</span>
              </div>
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setIsNotificationModalOpen(false)}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            icon={Lock}
            required
          />
          <Input
            label="New Password"
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            icon={Lock}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            icon={Lock}
            required
          />
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {success && (
        <div className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-md shadow-lg">
          {success}
        </div>
      )}
    </div>
  );
}