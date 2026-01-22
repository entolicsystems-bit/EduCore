import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("accessToken");

<<<<<<< HEAD
  
  if (!user) {
=======
  // if user is NOT logged in
  if (!token) {
>>>>>>> 4abeb698185233caddf91cfc03b4dfbe11b97a16
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
