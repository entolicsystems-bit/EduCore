import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  // if user is NOT logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // if logged in → allow page
  return children;
};

export default ProtectedRoute;
