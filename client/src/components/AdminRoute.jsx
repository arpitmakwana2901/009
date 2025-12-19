import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { decodeJwtPayload } from "../lib/jwt";

const AdminRoute = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error("⚠️ Please login to access admin panel");
    return (
      <Navigate to="/admin-auth" replace state={{ from: location.pathname }} />
    );
  }

  const payload = decodeJwtPayload(token || "");
  const role = payload?.role;

  if (role !== "admin") {
    toast.error("⛔ Admin access only");
    return (
      <Navigate
        to="/admin-auth"
        replace
        state={{ from: location.pathname, reason: "not-admin" }}
      />
    );
  }

  return children;
};

export default AdminRoute;
