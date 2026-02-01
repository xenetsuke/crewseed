import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = useSelector((s) => s.jwt);
  const user = useSelector((s) => s.user);

  if (token && user?.accountType) {
    return (
      <Navigate
        to={
          user.accountType === "APPLICANT"
            ? "/worker-dashboard"
            : "/employer-dashboard"
        }
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
