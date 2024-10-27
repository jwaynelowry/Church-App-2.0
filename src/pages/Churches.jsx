import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChurches } from '../hooks/useChurches';
import { Badge } from '../components/Badge';
import { Church, MapPin, Phone, Mail, Plus, Users, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export function Churches() {
  const navigate = useNavigate();
  const { churches, loading, error, createChurch } = useChurches();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    capacity: ''
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await createChurch(formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        capacity: ''
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (churchId) => {
    navigate(`/dashboard/churches/${churchId}`);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Churches</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor church locations
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="!inline-flex !w-auto items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Church
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-w-full divide-y divide-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Church
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {churches.map((church) => (
                  <tr 
                    key={church.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(church.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Church className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {church.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {church.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2" />
                          {church.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2" />
                          {church.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {church.memberCount || 0} members
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={church.status === 'active' ? 'success' : 'gray'}
                        className="capitalize"
                      >
                        {church.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Church"
      >
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Church Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <Input
              label="Capacity"
              type="number"
              id="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
            {formError && (
              <div className="text-sm text-red-600">{formError}</div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create Church
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}