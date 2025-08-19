import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthCtx = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state: user, token, loading; and actions login/register/logout. */
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      // Fetch current user
      api.me(token).then(setUser).catch(() => {
        setToken("");
        localStorage.removeItem("auth_token");
      }).finally(() => setLoading(false));
    } else {
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    // Expect backend to return token and optionally user
    if (res?.token) setToken(res.token);
    if (res?.user) setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    return res;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(() => ({ token, user, loading, login, register, logout }), [token, user, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access authentication context. */
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
