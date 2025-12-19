import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleAdminLogout = () => {
    toast.success("Logged out");
    logout();
    navigate("/admin-auth", { replace: true });
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
      <Link to="/admin">
        <img src={assets.logo} alt="logo" className="w-36 h-auto" />
      </Link>

      <button
        onClick={handleAdminLogout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer text-white text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
