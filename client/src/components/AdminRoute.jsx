import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

const decodeJwtPayload = (token) => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    // base64url -> base64
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error("⚠️ Please login to access admin panel");
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  const payload = decodeJwtPayload(token || "");
  const role = payload?.role;

  if (role !== "admin") {
    toast.error("⛔ Admin access only");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
