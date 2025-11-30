import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ClaimVerification from '../components/ClaimVerification';
import HelperScore from '../components/HelperScore';
import Chat from '../components/Chat';
import API from '../api';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ItemDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await API.get(`/items/${id}`);
      console.log('=== ITEM FETCH DEBUG ===');
      console.log('Full item data:', response.data);
      console.log('Claim attempts array:', response.data.claimAttempts);
      console.log('Claim attempts length:', response.data.claimAttempts?.length || 0);
      console.log('Current user ID:', user?._id);
      console.log('Item owner ID:', response.data.user?._id);
      console.log('Is owner?', user?._id === response.data.user?._id);
      console.log('========================');
      setItem(response.data);
    } catch (error) {
      toast.error('Item not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim items');
      navigate('/login');
      return;
    }
    setShowVerification(true);
  };

  const handleVerificationComplete = (verifiedItem) => {
    setShowVerification(false);
    // Always refresh item data to show updated claim attempts
    fetchItem();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };
  
  const handleApproveClaimRequest = async (claimAttemptId, approved) => {
    try {
      const response = await API.post(`/verification/approve/${id}/${claimAttemptId}`, {
        approved
      });
      
      if (response.data.success) {
        toast.success(approved ? 'Claim approved successfully!' : 'Claim rejected.');
        fetchItem(); // Refresh item data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process claim request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Item not found</p>
        <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
      </div>
    );
  }

  const isOwner = user && item.user._id === user._id;
  const canClaim = isAuthenticated && !isOwner && item.status === 'open' && item.type === 'found';
  const isItemClaimed = item.status === 'claimed';
  const isAdmin = user && user.role === 'admin';
  
  // Debug logs
  console.log('isOwner:', isOwner);
  console.log('user._id:', user?._id);
  console.log('item.user._id:', item.user._id);
  console.log('claimAttempts:', item.claimAttempts);
  
  const hasPendingClaims = item.claimAttempts && item.claimAttempts.some(attempt => !attempt.isVerified);
  const userHasClaimRequest = item.claimAttempts && item.claimAttempts.some(
    attempt => attempt.claimant && attempt.claimant._id === user?._id
  );
  
  console.log('hasPendingClaims:', hasPendingClaims);
  console.log('userHasClaimRequest:', userHasClaimRequest);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    return type === 'lost' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Debug Section - Moved to top for visibility */}
      {user && (
        <div className="card bg-red-50 border-red-200 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-red-800">🔧 DEBUG INFO (Remove after testing)</h3>
          <div className="text-sm space-y-1">
            <p><strong>User ID:</strong> {user._id}</p>
            <p><strong>Item Owner ID:</strong> {item.user._id}</p>
            <p><strong>Is Owner:</strong> {isOwner ? 'Yes' : 'No'}</p>
            <p><strong>Claim Attempts:</strong> {item.claimAttempts ? item.claimAttempts.length : 0}</p>
            <p><strong>Has Pending Claims:</strong> {hasPendingClaims ? 'Yes' : 'No'}</p>
            <p><strong>User Has Claim Request:</strong> {userHasClaimRequest ? 'Yes' : 'No'}</p>
            {item.claimAttempts && item.claimAttempts.length > 0 && (
              <div>
                <p><strong>Claim Attempts Details:</strong></p>
                {item.claimAttempts.map((attempt, idx) => (
                  <div key={idx} className="ml-4 text-xs">
                    <p>Attempt {idx + 1}: Claimant ID: {attempt.claimant?._id || attempt.claimant}, Verified: {attempt.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {!isOwner && item.type === 'found' && (
            <button 
              onClick={async () => {
                try {
                  const response = await API.post(`/verification/claim/${item._id}`, {
                    hiddenDetails: 'Test claim for debugging',
                    challengeAnswers: []
                  });
                  if (response.data.success) {
                    toast.success('Test claim added!');
                    fetchItem();
                  }
                } catch (error) {
                  toast.error('Failed to add test claim');
                }
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Add Test Claim
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(item.type)}`}>
                  {item.type.toUpperCase()}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
              
              {isOwner && (
                <div className="flex space-x-2">
                  <Link 
                    to={`/edit/${item._id}`}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
            
            {item.images && item.images.length > 0 && (
              <div className="mb-6 relative">
                <img 
                  src={item.images[0]} 
                  alt={item.title}
                  className={`w-full h-64 object-cover rounded-lg transition-all duration-300 ${
                    item.isPhotoBlurred !== false && !isOwner ? 'filter blur-sm hover:blur-none' : ''
                  }`}
                />
                {item.isPhotoBlurred !== false && !isOwner && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <div className="bg-white bg-opacity-95 px-4 py-2 rounded-lg text-center">
                      <p className="text-sm font-medium text-gray-800">Photo Hidden for Verification</p>
                      <p className="text-xs text-gray-600 mt-1">Claim to see full image</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Claim Section */}
          {canClaim && !showVerification && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-2">Claim This Item</h3>
              <p className="text-gray-700 mb-4">
                Do you think this is your {item.type} item? You'll need to verify ownership.
              </p>
              <button
                onClick={handleClaimClick}
                className="btn-primary"
              >
                Start Claim Verification
              </button>
            </div>
          )}
          
          {/* Item Already Claimed Message */}
          {isAuthenticated && !isOwner && isItemClaimed && item.type === 'found' && (
            <div className="card bg-gray-50 border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Item No Longer Available</h3>
              <p className="text-gray-700 mb-4">
                This item has already been claimed and verified. It is no longer available for new claim requests.
              </p>
            </div>
          )}
          
          {/* Lost Item Chat */}
          {isAuthenticated && !isOwner && item.status === 'open' && item.type === 'lost' && (
            <div className="card bg-orange-50 border-orange-200">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-orange-600" />
                Found This Item?
              </h3>
              <p className="text-gray-700 mb-4">
                If you found this item, chat with the owner to coordinate the return.
              </p>
              <button
                onClick={() => setShowChat(true)}
                className="btn-primary"
              >
                Chat with Owner
              </button>
            </div>
          )}

          {/* Verification Section */}
          {showVerification && !isItemClaimed && (
            <ClaimVerification 
              item={item} 
              user={user}
              onVerificationComplete={handleVerificationComplete}
            />
          )}
          


          {/* Pending Claims Section - Only for Owner */}
          {isOwner && item.claimAttempts && item.claimAttempts.length > 0 && (
            <div className="card bg-red-100 border-red-300 mb-4">
              <h3 className="text-lg font-semibold mb-2 text-red-800">🚨 CLAIM REQUESTS FOUND!</h3>
              <p>Claims: {item.claimAttempts.length}</p>
            </div>
          )}
          {isOwner && item.claimAttempts && item.claimAttempts.length > 0 && (
            <div className="card bg-orange-50 border-orange-200">
              <h3 className="text-lg font-semibold mb-4">Pending Claim Requests ({item.claimAttempts.length})</h3>
              {item.claimAttempts.map((attempt, index) => (
                <div key={attempt._id || index} className="border border-orange-200 rounded-lg p-4 mb-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">
                        Claimant: 
                        {attempt.claimant?._id ? (
                          <Link 
                            to={`/profile/${attempt.claimant._id}`} 
                            className="text-blue-600 hover:underline ml-1"
                            onClick={() => console.log('Navigating to profile:', attempt.claimant._id)}
                          >
                            {attempt.claimant.name || 'Unknown'}
                          </Link>
                        ) : (
                          <span className="ml-1">{attempt.claimant?.name || 'Unknown'} (ID: {JSON.stringify(attempt.claimant)})</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">Email: {attempt.claimant?.email || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Submitted: {attempt.attemptDate ? new Date(attempt.attemptDate).toLocaleDateString() : 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Status: {attempt.isVerified ? 'Verified' : 'Pending'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-1">Hidden Details Provided:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{attempt.hiddenDetailsProvided || 'No details'}</p>
                  </div>
                  
                  {!attempt.isVerified && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveClaimRequest(attempt._id, true)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        ✓ Approve Claim
                      </button>
                      <button
                        onClick={() => handleApproveClaimRequest(attempt._id, false)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        ✗ Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Chat Section - Available for found items with claimants */}
          {isAuthenticated && item.type === 'found' && (isOwner || userHasClaimRequest) && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-green-600" />
                Chat with {isOwner ? 'Claimants' : 'Item Owner'}
              </h3>
              <p className="text-gray-700 mb-4">
                Coordinate the return of this item through real-time chat.
              </p>
              <button
                onClick={() => setShowChat(true)}
                className="btn-primary"
              >
                Open Chat
              </button>
            </div>
          )}

          {/* Chat Section - Available for lost item owners */}
          {isAuthenticated && item.type === 'lost' && isOwner && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                Chat with Finders
              </h3>
              <p className="text-gray-700 mb-4">
                Communicate with people who may have found your item.
              </p>
              <button
                onClick={() => setShowChat(true)}
                className="btn-primary"
              >
                Open Chat
              </button>
            </div>
          )}

          {/* Claimed Info */}
          {item.status === 'claimed' && item.claimedBy && (
            <div className="card bg-yellow-50 border-yellow-200">
              <h3 className="text-lg font-semibold mb-2">Item Claimed</h3>
              <p className="text-gray-700">
                This item has been claimed by {item.claimedBy.name} on{' '}
                {new Date(item.claimDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Item Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <TagIcon className="h-4 w-4 text-gray-400" />
                <span className="capitalize">{item.category}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span>{item.location}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              {item.reward > 0 && (
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  <span>${item.reward} reward</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span>{item.user.name}</span>
                </div>
                <HelperScore user={item.user} compact={true} />
              </div>
              
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <span>{item.contact || item.user.email}</span>
              </div>
              
              {item.user.phone && (
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span>{item.user.phone}</span>
                </div>
              )}
              

            </div>
            
            {/* Helper Score Display */}
            {item.user && (
              <div className="mt-4 pt-4 border-t">
                <HelperScore user={item.user} />
              </div>
            )}
            
            {/* Admin-only claimed details */}
            {isAdmin && item.status === 'claimed' && item.claimedBy && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">Claimed By:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span>{item.claimedBy.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span>{item.claimedBy.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      {showChat && (
        <Chat 
          itemId={item._id} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
};

export default ItemDetail;