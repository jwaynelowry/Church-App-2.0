import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { Mail } from 'lucide-react';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setEmail('');
    }
    
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
    >
      {success ? (
        <div className="mt-8 space-y-6">
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-700">
              Password reset link has been sent to your email address. Please check your inbox.
            </p>
          </div>
          <Link
            to="/login"
            className="block w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            error={error}
            autoComplete="email"
          />

          <Button type="submit" isLoading={isLoading}>
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}