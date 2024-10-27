import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function DashboardHeader({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 relative z-30">
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 lg:hidden hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-center ml-auto">
          <span className="text-sm text-gray-700 mr-4 hidden sm:block">
            {user?.email}
          </span>
          <Button
            onClick={handleSignOut}
            className="!inline-flex !w-auto items-center relative z-20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}