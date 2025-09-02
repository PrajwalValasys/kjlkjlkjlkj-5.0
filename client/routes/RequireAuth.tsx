import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@/store/reducers/authSlice';
import authService from '@/api/services/authService';

export default function RequireAuth() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasToken = authService.isAuthenticated();
  const location = useLocation();

  if (isLoggedIn || hasToken) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}
