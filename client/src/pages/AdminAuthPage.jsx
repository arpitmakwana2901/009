import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../components/context/AuthContext";
import { decodeJwtPayload } from "../lib/jwt";
import { API_URL } from "../App";

const AdminAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const payload = decodeJwtPayload(token);
    if (payload?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!data.email.trim() || !data.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email: data.email,
        password: data.password,
      });

      const token = response.data?.myToken;
      if (!token) {
        toast.error("Login failed");
        return;
      }

      const payload = decodeJwtPayload(token);
      if (payload?.role !== "admin") {
        // Ensure we don't keep a non-admin token in storage.
        logout();
        toast.error("⛔ This account is not an admin");
        return;
      }

      const adminInfo = {
        firstName: "Admin",
        lastName: "",
        email: data.email,
      };

      login(token, adminInfo);

      toast.success("✅ Admin login successful");

      const from = location.state?.from;
      navigate(from || "/admin", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Admin login failed");
    }
  };

  const currentPayload = isAuthenticated ? decodeJwtPayload(token) : null;
  const currentRole = currentPayload?.role;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="py-4 px-6 bg-red-600 text-white">
          <h2 className="text-lg font-semibold">Admin Login</h2>
          <p className="text-sm opacity-90">Use your admin credentials</p>
        </div>

        <div className="p-6 text-black">
          {isAuthenticated && currentRole && currentRole !== "admin" && (
            <div className="mb-4 p-3 rounded-lg border border-gray-300 bg-gray-50">
              <p className="text-sm font-medium">You are logged in as a user.</p>
              <p className="text-xs text-gray-600 mt-1">
                Please logout first, then login with admin credentials.
              </p>
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out. Now login as admin.");
                }}
                className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm"
              >
                Logout & Continue
              </button>
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
            value={data.email}
            onChange={handleInputChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
            value={data.password}
            onChange={handleInputChange}
          />

          <button
            disabled={isAuthenticated && currentRole && currentRole !== "admin"}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            onClick={handleAdminLogin}
          >
            Login as Admin
          </button>

          <div className="text-center mt-4">
            <Link to="/auth" className="text-sm text-black hover:text-red-600 underline">
              Login as User
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-black hover:text-red-600 underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
