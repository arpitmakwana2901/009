import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const login = (newToken, userInfo = null) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (userInfo) {
      localStorage.setItem("userData", JSON.stringify(userInfo));
      setUserData(userInfo);
    }

    console.log("Login successful - token and user data stored");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    setUserData(null);
    console.log("Logout successful - all data cleared");
  };

  const updateUserData = (userInfo) => {
    localStorage.setItem("userData", JSON.stringify(userInfo));
    setUserData(userInfo);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        userData,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
