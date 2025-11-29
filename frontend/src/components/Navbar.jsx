import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Lost & Found</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Browse Items
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/add" 
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Report Item</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                    <UserIcon className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Items
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/add" 
                    className="text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Report Item
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-blue-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:text-blue-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;