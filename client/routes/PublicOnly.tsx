import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@/store/reducers/authSlice';
import authService from '@/api/services/authService';

export default function PublicOnly() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasToken = authService.isAuthenticated();

  if (isLoggedIn || hasToken) return <Navigate to="/" replace />;
  return <Outlet />;
}
