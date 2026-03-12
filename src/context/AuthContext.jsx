import React, { createContext, useState, useEffect, useCallback } from "react";
import { ROLES } from "../utils/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // ✅ Log in user + persist data
  const login = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData));
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

  // ✅ Sync state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Auth state recovery failed:", e);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};