import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  DocumentIcon,
  SwatchIcon,
  ShoppingBagIcon,
  KeyIcon,
  CubeIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

const ItemCard = ({ item }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'claimed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'returned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    return type === 'lost' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const getCategoryIcon = (category) => {
    const iconProps = { className: "h-5 w-5" };
    switch (category) {
      case 'electronics': return <DevicePhoneMobileIcon {...iconProps} />;
      case 'documents': return <DocumentIcon {...iconProps} />;
      case 'clothing': return <SwatchIcon {...iconProps} />;
      case 'accessories': return <GiftIcon {...iconProps} />;
      case 'bags': return <ShoppingBagIcon {...iconProps} />;
      case 'keys': return <KeyIcon {...iconProps} />;
      default: return <CubeIcon {...iconProps} />;
    }
  };

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'electronics': return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
      case 'documents': return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
      case 'clothing': return 'border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white';
      case 'accessories': return 'border-l-4 border-l-pink-500 bg-gradient-to-r from-pink-50 to-white';
      case 'bags': return 'border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white';
      case 'keys': return 'border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white';
      default: return 'border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50 to-white';
    }
  };

  return (
    <div className={`card hover:shadow-lg transition-all duration-300 hover:scale-105 ${getCategoryStyle(item.category)}`}>
      {item.images && item.images.length > 0 && (
        <div className="mb-4 relative">
          <img 
            src={item.images[0]} 
            alt={item.title}
            className={`w-full h-48 object-cover rounded-lg transition-all duration-300 ${
              item.isPhotoBlurred !== false ? 'filter blur-sm hover:blur-none' : ''
            }`}
          />
          {item.isPhotoBlurred !== false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
              <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                Photo hidden for verification
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
              {item.type.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
              {item.status.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(item.category)}
            <span className="capitalize font-medium">{item.category}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          
          {(item.reporterName || item.user?.name) && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Reported by {item.reporterName || item.user.name}</span>
              </div>
              {item.user?.helperScore > 0 && (
                <div className="flex items-center space-x-1 text-xs">
                  <GiftIcon className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 font-medium">{item.user.helperScore}pts</span>
                </div>
              )}
            </div>
          )}
          
          {item.claimerName && (
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-700">Claimed by {item.claimerName}</span>
            </div>
          )}
          
          {item.reward > 0 && (
            <div className="flex items-center space-x-2">
              <GiftIcon className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium">${item.reward} reward</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <Link 
            to={`/items/${item._id}`}
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;