import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/*
  ProtectedRoute
  ----------------
  - Checks if JWT token exists (Redux)
  - Optionally checks allowedRoles
  - Redirects accordingly
*/

const ProtectedRoute = ({ children, allowedRoles }) => {
  // JWT stored in Redux (set during login)
  const token = useSelector((state) => state.jwt);

  // Account type stored in localStorage after login
  // Example: APPLICANT / EMPLOYER
  const accountType = localStorage.getItem("accountType") || "";

  /* =========================
     Not Logged In
  ========================= */
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     Role-Based Access Control
  ========================= */
  if (allowedRoles && !allowedRoles.includes(accountType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* =========================
     Authorized
  ========================= */
  return children;
};

export default ProtectedRoute;
