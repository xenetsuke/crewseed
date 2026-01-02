import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.jwt?.jwt);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
