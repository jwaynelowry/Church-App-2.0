import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';
import { useAuth } from './hooks/useAuth.js';
import { Feed } from './pages/Feed.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { DashboardLayout } from './components/DashboardLayout.jsx';
import { Admins } from './pages/Admins.jsx';
import { AdminDetails } from './pages/AdminDetails.jsx';
import { Churches } from './pages/Churches.jsx';
import { ChurchDetails } from './pages/ChurchDetails.jsx';
import { ChurchProfile } from './pages/ChurchProfile.jsx';
import { Profile } from './pages/Profile.jsx';
import { UserChurches } from './pages/UserChurches.jsx';

function PrivateRoute({ children, requireAdmin }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default function App() {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'admin':
        return <Dashboard />;
      case 'church':
        return <Dashboard />;
      default:
        return <Feed />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={getDashboardComponent()} />
          <Route path="profile" element={<Profile />} />
          <Route path="churches" element={<UserChurches />} />
          <Route path="churches/:churchId/profile" element={<ChurchProfile />} />
          <Route 
            path="admin/churches" 
            element={
              <PrivateRoute requireAdmin>
                <Churches />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin/churches/:churchId" 
            element={
              <PrivateRoute requireAdmin>
                <ChurchDetails />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin/admins" 
            element={
              <PrivateRoute requireAdmin>
                <Admins />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin/admins/:adminId" 
            element={
              <PrivateRoute requireAdmin>
                <AdminDetails />
              </PrivateRoute>
            } 
          />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}