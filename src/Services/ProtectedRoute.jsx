import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = useSelector((s) => s.jwt);
  const user = useSelector((s) => s.user);

  if (!token || !user?.id) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    user.accountType &&
    !allowedRoles.includes(user.accountType)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
