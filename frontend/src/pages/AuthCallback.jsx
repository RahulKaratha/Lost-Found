import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    console.log('🔵 AuthCallback - Token:', token ? 'Present' : 'Missing');
    console.log('🔵 AuthCallback - Error:', error);
    
    if (error) {
      toast.error('Google authentication failed');
      navigate('/login');
      return;
    }
    
    if (token) {
      console.log('🔵 AuthCallback - Processing token');
      // Store token
      sessionStorage.setItem('token', token);
      
      toast.success('Successfully logged in with Google!');
      console.log('🟢 AuthCallback - Redirecting to home');
      
      // Simple redirect without API call
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      console.log('🔴 AuthCallback - No token found');
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;