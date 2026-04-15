import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * ProtectRoutes — wraps protected (dashboard) routes.
 * Redirects unauthenticated users to the login page.
 */
export const ProtectRoutes = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

/**
 * AuthProtectRoutes — wraps auth routes (login, forgot-password, etc.).
 * Redirects already-authenticated users to the dashboard.
 */
export const AuthProtectRoutes = () => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" state={{ from: location }} replace />
  );
};
