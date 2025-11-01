import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ROLES } from "../utils/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const endpoints = {
    verify: `${API_BASE_URL}/verify-token.php`,
    refresh: `${API_BASE_URL}/refresh-token.php`,
  };

  // ✅ Log in user + persist data
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Log out user + clear storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  // ✅ Optional refresh (if needed)
  const refreshToken = async () => {
    try {
      const res = await axios.post(endpoints.refresh, {}, { withCredentials: true });
      if (res.data.success) {
        const { user, token } = res.data;
        login(user, token);
        return token;
      } else {
        logout();
        return null;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  // ✅ Verify token silently in background
 useEffect(() => {
  const token = localStorage.getItem("jwt");
  const storedUser = localStorage.getItem("user");

  // Instantly show user if already logged in
  if (token && storedUser) {
    setUser(JSON.parse(storedUser));
  }

  // Silent token verification (non-blocking)
  (async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        endpoints.verify,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        login(res.data.user, token);
      } else {
        await refreshToken();
      }
    } catch {
      await refreshToken();
    }
  })();

  setLoading(false); // Don’t block UI
}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
