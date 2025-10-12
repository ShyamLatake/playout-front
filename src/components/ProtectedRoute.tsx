import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UserType } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes,
  redirectTo = '/login'
}) => {
  const { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    const dashboardRoutes = {
      admin: '/admin-dashboard',
      turf_owner: '/turf-dashboard',
      normal_user: '/my-dashboard'
    };
    
    return <Navigate to={dashboardRoutes[user.userType]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;