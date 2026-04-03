/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from "react";
import { ROLES } from "../utils/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const jwt = localStorage.getItem("jwt");
      if (!jwt || !storedUser) return null;
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse stored user", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // ✅ Log in user + persist data
  const login = useCallback((userData, token) => {
    const normalizedUser = { ...userData, role: userData.role?.toLowerCase() };
    setUser(normalizedUser);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }, []);

  // ✅ Log out user + clear storage
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  }, []);

  const refreshToken = useCallback(async () => {
    // Current backend doesn't support refresh tokens via Axios at this endpoint
    return null;
  }, []);

  // ✅ Sync state with localStorage + Verify Token on boot
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwt");
      const storedUser = localStorage.getItem("user");
      
      console.log("🔑 [AuthContext Boot]", { hasToken: !!token, hasUser: !!storedUser, url: window.location.href });

      if (token) {
        try {
          const apiBase = import.meta.env.VITE_API_URL || "https://eaglenet-backend.onrender.com";
          const response = await fetch(`${apiBase}/api/auth/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          console.log("🔍 [AuthContext Verify Response]", { ok: response.ok, status: response.status });

          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && data.data) {
              const freshUser = { ...data.data, role: data.data.role?.toLowerCase() };
              setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));
            }
          } else if (response.status === 401 || response.status === 403) {
            console.warn("🚫 [AuthContext] Session expired or invalid token. Logging out.");
            logout();
          }
        } catch (e) {
          console.error("⚠️ [AuthContext] Verify error (network?):", e);
        }
      } else if (storedUser) {
        // We have a user object but NO token? This is inconsistent.
        console.warn("⚠️ [AuthContext] User found in storage but JWT is missing. Clearing.");
        logout();
      }
      setLoading(false);
    };

    verifyToken();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};