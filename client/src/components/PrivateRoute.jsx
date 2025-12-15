import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isLogoutAction =
    new URLSearchParams(location.search).get("logout") === "true";

  if (!isAuthenticated && !isLogoutAction) {
    toast.error("⚠️ Please login to access this page", {
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#d32f2f",
        color: "#fff",
        padding: "14px",
        fontWeight: "bold",
      },
    });

    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
