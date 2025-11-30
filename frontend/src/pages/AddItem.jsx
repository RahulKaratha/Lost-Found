import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateItemForm } from '../utils/validation';
import API from '../api';
import toast from 'react-hot-toast';

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'documents', label: 'Documents' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' },
  { value: 'keys', label: 'Keys' },
  { value: 'other', label: 'Other' }
];

const AddItem = () => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'other',
    location: '',
    contact: '',
    imageUrl: '',
    tags: '',
    dateLostFound: '',
    reward: '',
    hiddenDetails: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = validateItemForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        contact: formData.contact || user.email,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        reward: formData.reward ? parseFloat(formData.reward) : 0,
        dateLostFound: formData.dateLostFound ? new Date(formData.dateLostFound) : undefined
      };
      
      console.log('Submitting data:', submitData);
      await API.post('/items', submitData);
      toast.success('Item reported successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Report Lost/Found Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Brief description of the item"
              required
              maxLength={100}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Detailed description including color, size, brand, etc."
              required
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</div>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`input-field ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Where was it lost/found?"
              required
              maxLength={200}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Info
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`input-field ${errors.contact ? 'border-red-500' : ''}`}
              placeholder="Phone or email (optional)"
            />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use your registered email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Lost/Found (Optional)
              </label>
              <input
                type="date"
                name="dateLostFound"
                value={formData.dateLostFound}
                onChange={handleChange}
                className={`input-field ${errors.dateLostFound ? 'border-red-500' : ''}`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateLostFound && <p className="text-red-500 text-xs mt-1">{errors.dateLostFound}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reward ($) (Optional)
              </label>
              <input
                type="number"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                className={`input-field ${errors.reward ? 'border-red-500' : ''}`}
                placeholder="0"
                min="0"
                max="10000"
                step="0.01"
              />
              {errors.reward && <p className="text-red-500 text-xs mt-1">{errors.reward}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hidden Details for Verification *
            </label>
            <textarea
              name="hiddenDetails"
              value={formData.hiddenDetails}
              onChange={handleChange}
              rows={3}
              className={`input-field ${errors.hiddenDetails ? 'border-red-500' : ''}`}
              placeholder="Details only the true owner would know (e.g., what's inside, scratches, serial numbers)"
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">These details won't be shown publicly but will be used to verify claims.</p>
            {errors.hiddenDetails && <p className="text-red-500 text-xs mt-1">{errors.hiddenDetails}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="red, leather, wallet (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas. Max 30 characters per tag.</p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Reporting...' : 'Report Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;