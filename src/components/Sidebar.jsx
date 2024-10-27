import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Settings,
  X,
  UserCog,
  Church,
  User,
  MessageSquare,
  Calendar,
  Users,
  FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCog, label: 'Admins', path: '/dashboard/admin/admins' },
    { icon: Church, label: 'Churches', path: '/dashboard/admin/churches' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const churchMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Members', path: '/dashboard/members' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: FileText, label: 'Posts', path: '/dashboard/posts' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const userMenuItems = [
    { icon: MessageSquare, label: 'Feed', path: '/dashboard' },
    { icon: Church, label: 'Churches', path: '/dashboard/churches' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'church':
        return churchMenuItems;
      default:
        return userMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 transition-opacity duration-300 lg:hidden z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b lg:h-[64px]">
          <h2 className="text-xl font-semibold text-gray-800">Church App</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 lg:hidden hover:bg-gray-100 rounded-md"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md group"
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <item.icon className="h-5 w-5 mr-3 text-gray-500 group-hover:text-indigo-600" />
              <span className="group-hover:text-indigo-600">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}