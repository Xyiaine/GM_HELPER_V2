import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function ProtectedRoute() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="loading-screen">Loading GM Helper...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
