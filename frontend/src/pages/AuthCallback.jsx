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
    console.log('🔵 AuthCallback - Error:', error || 'None');

    if (error) {
      toast.error('Google authentication failed');
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      console.log('🔵 AuthCallback - Processing token:', token);

      // Save token
      localStorage.setItem('token', token);

      toast.success('Logged in successfully!');

      // Redirect to home (let AuthContext load user)
      navigate('/', { replace: true });
    } else {
      console.log('🔴 AuthCallback - No token found');
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

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
