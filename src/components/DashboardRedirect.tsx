import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from './LoadingSpinner';

const DashboardRedirect: React.FC = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user type
      switch (user.userType) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'turf_owner':
          navigate('/turf-dashboard', { replace: true });
          break;
        case 'normal_user':
          navigate('/my-dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } else if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return null;
};

export default DashboardRedirect;