import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../App";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const showToast = (type, message) => {
    const toastOptions = {
      duration: 2000,
      style: {
        borderRadius: "12px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "16px 20px",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.1)",
        minWidth: "300px",
      },
    };

    if (type === "success") {
      toast.success(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
        },
      });
    } else if (type === "error") {
      toast.error(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
        },
      });
    } else if (type === "validation") {
      toast.error(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
        },
        icon: "⚠️",
      });
    } else if (type === "info") {
      toast(message, {
        ...toastOptions,
        style: {
          ...toastOptions.style,
          background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
        },
        icon: "👋",
      });
    }
  };

  async function handleRegister(e) {
    e.preventDefault();

    if (!data.userName.trim() || !data.email.trim() || !data.password.trim()) {
      showToast("validation", "Please fill in all required fields");
      return;
    }
    if (data.password.length < 6) {
      showToast("validation", "Password must be at least 6 characters");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      showToast("validation", "Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/user/registration`,
        data
      );

      showToast(
        "success",
        response.data.message || "Account created successfully"
      );

      setData({
        userName: "",
        email: "",
        password: "",
      });

      // Auto switch to login after successful registration
      setTimeout(() => {
        setActiveTab("login");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again";
      showToast("error", errorMessage);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!data.email.trim() || !data.password.trim()) {
      showToast("validation", "Email and password are required");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/user/login`,
        { email: data.email, password: data.password }
      );

      const toastId = toast.success(
        response.data.message || "Welcome back! Redirecting...",
        {
          duration: 2000,
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
            color: "#fff",
            padding: "16px 20px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: "300px",
          },
        }
      );

      // Assume response mein user data aata hai
      // Aapke API response ke according adjust karein
      const userInfo = {
        firstName:
          response.data.user?.firstName ||
          response.data.user?.name?.split(" ")[0] ||
          data.email.split("@")[0],
        lastName:
          response.data.user?.lastName ||
          response.data.user?.name?.split(" ")[1] ||
          "",
        email: response.data.user?.email || data.email,
        // Aur koi bhi additional data jo aapko chahiye
      };

      login(response.data.myToken, userInfo);
      setData({
        email: "",
        password: "",
      });

      setTimeout(() => {
        toast.dismiss(toastId);
        navigate("/movies");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials";
      showToast("error", errorMessage);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/80 px-4">
      {/* Professional Toaster with custom styling */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            padding: "16px 20px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.1)",
            minWidth: "300px",
          },
        }}
      />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex">
          <button
            className={`w-1/2 py-3 text-lg font-medium ${
              activeTab === "login"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-3 text-lg font-medium ${
              activeTab === "signup"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form Section */}
        <div className="p-6 text-black">
          {activeTab === "login" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
              {/* Form elements use 'name' and call generic handler */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={handleInputChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={handleInputChange}
              />

              <button
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleLogin}
              >
                Login
              </button>
              <p className="text-sm text-black mt-3 text-center">
                Don't have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-medium"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </span>
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Account</h2>
              <input
                type="text"
                name="userName"
                placeholder="Full Name"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.userName}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-3 rounded mb-3 text-black placeholder:text-gray-500 focus:outline-red-600"
                value={data.password}
                onChange={handleInputChange}
              />
              <button
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleRegister}
              >
                Sign Up
              </button>
              <p className="text-sm text-black mt-3 text-center">
                Already have an account?{" "}
                <span
                  className="text-red-600 cursor-pointer font-medium"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </span>
              </p>
            </div>
          )}

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-black hover:text-red-600 text-sm underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
