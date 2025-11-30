import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import ItemCard from '../components/ItemCard';
import HelperScore from '../components/HelperScore';
import toast from 'react-hot-toast';
import { PlusIcon, UserIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [activeTab, setActiveTab] = useState('myItems');
  const [myItems, setMyItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isOwnProfile = !userId || userId === user?._id;
  const displayUser = isOwnProfile ? user : profileUser;

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [userId, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      if (isOwnProfile) {
        const [myItemsRes, claimedRes] = await Promise.all([
          API.get('/items/my-items'),
          API.get('/items/claimed')
        ]);
        setMyItems(myItemsRes.data);
        setClaimedItems(claimedRes.data);
      } else {
        // Fetch other user's profile and public items
        try {
          const [userRes, itemsRes] = await Promise.all([
            API.get(`/auth/user/${userId}`),
            API.get(`/items?userId=${userId}`)
          ]);
          setProfileUser(userRes.data);
          setMyItems(itemsRes.data);
          setClaimedItems([]); // Don't show claimed items for other users
        } catch (apiError) {
          console.error('API Error:', apiError);
          if (apiError.response?.status === 404) {
            setProfileUser(null);
            setMyItems([]);
          } else {
            throw apiError;
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = isOwnProfile ? [
    { id: 'myItems', label: 'My Items', icon: ClipboardDocumentListIcon, count: myItems.length },
    { id: 'claimed', label: 'Claimed Items', icon: UserIcon, count: claimedItems.length }
  ] : [
    { id: 'myItems', label: 'Reported Items', icon: ClipboardDocumentListIcon, count: myItems.length }
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isOwnProfile && !profileUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-4">The user profile you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayUser?.name}</h1>
              <p className="text-gray-600">{displayUser?.email}</p>
              {displayUser?.phone && (
                <p className="text-gray-600">Phone: {displayUser.phone}</p>
              )}
              {displayUser?.role === 'admin' && (
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <Link 
              to="/add"
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Report Item</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats and Helper Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{myItems.length}</div>
              <div className="text-gray-600">Items Reported</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{claimedItems.length}</div>
              <div className="text-gray-600">Items Claimed</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600">
                {myItems.filter(item => item.status === 'returned').length}
              </div>
              <div className="text-gray-600">Items Returned</div>
            </div>
          </div>
        </div>
        <div>
          <HelperScore user={displayUser} />
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'myItems' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">My Reported Items</h3>
                  {myItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">You haven't reported any items yet.</p>
                      <Link to="/add" className="btn-primary">
                        Report Your First Item
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myItems.map(item => (
                        <ItemCard key={item._id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'claimed' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Items I've Claimed</h3>
                  {claimedItems.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">You haven't claimed any items yet.</p>
                      <Link to="/" className="btn-primary">
                        Browse Available Items
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {claimedItems.map(item => (
                        <ItemCard key={item._id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;