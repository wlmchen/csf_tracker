import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./auth.context";

const PrivateRoutes = ({ roles, unprotected }) => {
  const { user } = useAuth();

  if (!unprotected) {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (!roles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }
  if (unprotected === true) {
    if (user) {
      return <Navigate to="/dashboard" />;
    }
    return <Outlet />;
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
