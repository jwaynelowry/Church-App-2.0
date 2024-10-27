import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { Mail, Lock } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setErrors({
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      });
      setIsLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Please sign in to your account"
    >
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            error={errors.email}
            icon={Mail}
          />
          <Input
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            error={errors.password}
            icon={Lock}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}