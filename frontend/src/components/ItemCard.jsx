import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon,
  UserIcon 
} from '@heroicons/react/24/outline';

const ItemCard = ({ item }) => {
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
    <div className="card hover:shadow-lg transition-shadow">
      {item.images && item.images.length > 0 && (
        <div className="mb-4">
          <img 
            src={item.images[0]} 
            alt={item.title}
            className="w-full h-48 object-cover rounded-lg"
          />
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
            <TagIcon className="h-4 w-4" />
            <span className="capitalize">{item.category}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          
          {item.user && (
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>By {item.user.name}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <Link 
            to={`/items/${item._id}`}
            className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;