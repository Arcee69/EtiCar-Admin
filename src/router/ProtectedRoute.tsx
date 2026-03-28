import { Navigate, useLocation, Outlet  } from 'react-router-dom';
import { isObjectEmpty } from '../utils';

export const ProtectRoutes = () => {
    const location = useLocation();
    const userObj = localStorage.getItem("userObj");
    const isAuthed = userObj ? isObjectEmpty(JSON.parse(userObj)) : true;
    return !isAuthed ? (
      <Outlet />
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    );
  };

  export const AuthProtectRoutes = () => {
    const location = useLocation();
    const userObj = localStorage.getItem("userObj");
    const isAuthed = userObj ? isObjectEmpty(JSON.parse(userObj)) : true;
    return isAuthed ? (
      <Outlet />
    ) : (
      <Navigate to="/overview" state={{ from: location }} replace />
    );
  };
