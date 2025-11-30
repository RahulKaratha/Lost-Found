import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import toast from 'react-hot-toast';

const PhoneSetup = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{1,3}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{0,9}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await API.put('/auth/profile', { phone: phone.trim() });
      toast.success('Phone number added successfully!');
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
        
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">
            Welcome, {user?.name}!
          </p>
          <p className="text-sm text-gray-500">
            Please add your phone number to complete your profile setup.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="+1234567890 or (123) 456-7890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used for contact purposes when items are found/lost.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneSetup;