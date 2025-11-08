import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ROLES } from "../utils/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Initialize immediately from localStorage (instant state on reload)
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const endpoints = {
    verify: `${API_BASE_URL}/verify-token.php`,
    refresh: `${API_BASE_URL}/refresh-token.php`,
    login: `${API_BASE_URL}/login.php`,
    register: `${API_BASE_URL}/reg.php`,
  };

  // ✅ Log in: save user + token to localStorage
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user too
  };

  // ✅ Log out: clear storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  // ✅ Refresh JWT if needed
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

<<<<<<< HEAD
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
      if (!token) {
        setLoading(false); // ✅ No token = stop loading
        return;
      }

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
      } finally {
        setLoading(false); // ✅ Always stop loading after verification
      }
    })();

    // ❌ REMOVED: setLoading(false); - This was the bug!
=======
  // ✅ Silent background token verification
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify silently (but don’t block UI)
        const res = await axios.post(
          endpoints.verify,
          {},
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );

        if (res.data.success) {
          login(res.data.user, token); // refresh user info if needed
        } else {
          await refreshToken();
        }
      } catch (err) {
        await refreshToken();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
>>>>>>> e6f0a7fc6bbeab5389fec682218ce7a3b11b9f2a
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};