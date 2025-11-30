import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import API from '../api';
import toast from 'react-hot-toast';

const ClaimVerification = ({ item, onVerificationComplete }) => {
  const [hiddenDetails, setHiddenDetails] = useState('');
  const [challengeAnswers, setChallengeAnswers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, [item._id]);

  const fetchChallenges = async () => {
    try {
      const response = await API.get(`/verification/challenges/${item._id}`);
      setChallenges(response.data.challenges);
      setChallengeAnswers(new Array(response.data.challenges.length).fill(''));
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const handleChallengeAnswer = (index, value) => {
    const newAnswers = [...challengeAnswers];
    newAnswers[index] = value;
    setChallengeAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hiddenDetails.trim()) {
      toast.error('Please provide hidden details');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post(`/verification/claim/${item._id}`, {
        hiddenDetails,
        challengeAnswers
      });

      if (response.data.success) {
        toast.success('Claim verified successfully!');
        onVerificationComplete(response.data.item);
      } else {
        toast.error('Verification failed. Please check your details.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ShieldCheckIcon className="h-6 w-6 text-yellow-600 mr-2" />
        <h3 className="text-lg font-semibold text-yellow-800">Claim Verification Required</h3>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center mb-2">
          <EyeSlashIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Photo Challenge</span>
        </div>
        <p className="text-sm text-blue-700">
          The full image is hidden to prevent false claims. Provide details only the true owner would know.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provide details not shown in the public listing *
          </label>
          <textarea
            value={hiddenDetails}
            onChange={(e) => setHiddenDetails(e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Describe specific details like contents, scratches, serial numbers, etc."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Be specific about details only the true owner would know.
          </p>
        </div>

        {challenges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Verification Questions</h4>
            {challenges.map((challenge, index) => (
              <div key={challenge._id} className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  {challenge.question}
                </label>
                <input
                  type="text"
                  value={challengeAnswers[index] || ''}
                  onChange={(e) => handleChallengeAnswer(index, e.target.value)}
                  className="input-field"
                  placeholder="Your answer..."
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => onVerificationComplete(null)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimVerification;