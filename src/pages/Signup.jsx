import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout.jsx';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { Modal } from '../components/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalError, setModalError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setModalError(null);

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    };

    try {
      const { user, error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setModalError('Email already in use or invalid. Please try again.');
        setIsLoading(false);
        return;
      }

      if (user) {
        setIsLoading(false);
        navigate('/login', { 
          state: { message: 'Account created successfully! Please sign in.' },
          replace: true
        });
      }
    } catch (error) {
      setModalError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Create an account"
        subtitle="Start your journey with us today"
      >
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
                error={errors.firstName}
              />
              <Input
                label="Last name"
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
                error={errors.lastName}
              />
            </div>
            <Input
              label="Email address"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
              error={errors.confirmPassword}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Create account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>

      <Modal
        isOpen={!!modalError}
        onClose={() => setModalError(null)}
        title="Error"
      >
        <p className="text-sm text-gray-500">{modalError}</p>
        <div className="mt-4">
          <Button onClick={() => setModalError(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}