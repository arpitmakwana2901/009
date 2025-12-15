import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, XIcon, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    const toastOptions = {
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
        padding: "16px",
        fontWeight: "bold",
      },                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    };

    if (type === "success") {
      toast.success(message, toastOptions);
    } else if (type === "error") {
      toast.error(message, {
        ...toastOptions,
        style: { ...toastOptions.style, background: "#d32f2f" },
      });
    } else if (type === "info") {
      toast(message, {
        ...toastOptions,
        style: { ...toastOptions.style, background: "#2196F3" },
        icon: "👋",
      });
    }
  };

  const handleLogout = () => {
    showToast("info", "Logged out successfully!");

    logout();

    setTimeout(() => {
      navigate("/?logout=true", { replace: true });
    }, 600);
  };

  const getUserDisplayName = () => {
    if (userData) {
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";

      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      } else if (userData.email) {
        return userData.email.split("@")[0];
      }
    }
    return "User";
  };

  const getUserInitials = () => {
    if (userData) {
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";

      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      } else if (firstName) {
        return firstName.charAt(0).toUpperCase();
      } else if (lastName) {
        return lastName.charAt(0).toUpperCase();
      } else if (userData.email) {
        return userData.email.charAt(0).toUpperCase();
      }
    }
    return "U";
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/movies"
        >
          Movies
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Theaters
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
        >
          Releases
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorite"
        >
          Favorites
        </Link>

        {isAuthenticated && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-8">
            {/* User info for mobile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {getUserInitials()}
              </div>
              <span className="text-white font-medium">
                {getUserDisplayName()}
              </span>
            </div>

            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!isAuthenticated ? (
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-full font-medium cursor-pointer text-white max-md:hidden"
            >
              <span>Logout</span>
            </button>

            <div className="flex items-center gap-2 max-md:hidden">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {getUserInitials()}
              </div>
              <span className="text-sm font-medium">
                {getUserDisplayName()}
              </span>
            </div>
          </div>
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
