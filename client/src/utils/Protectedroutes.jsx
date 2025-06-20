import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, permission }) => {
  const allowedPages = useSelector((state) => state.auth.allowedPages) || [];

  return allowedPages.includes(permission) ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
