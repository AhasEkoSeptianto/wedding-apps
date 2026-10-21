"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, LoginPayload, RegisterPayload, UserProfile } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("janjisuci_auth_token");
      localStorage.removeItem("janjisuci_auth_user");
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Rehydrate auth state on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("janjisuci_auth_token");
      const storedUser = localStorage.getItem("janjisuci_auth_user");

      if (storedToken) {
        queueMicrotask(() => {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // Ignore parse error
            }
          }
        });

        // Verify with backend
        api.getMe(storedToken)
          .then((res) => {
            if (res.user) {
              setUser(res.user);
              localStorage.setItem("janjisuci_auth_user", JSON.stringify(res.user));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        queueMicrotask(() => {
          setIsLoading(false);
        });
      }
    } catch (err) {
      console.error("Auth rehydration error:", err);
      queueMicrotask(() => {
        setIsLoading(false);
      });
    }
  }, [logout]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await api.login(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("janjisuci_auth_token", res.token);
      localStorage.setItem("janjisuci_auth_user", JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("janjisuci_auth_token", res.token);
      localStorage.setItem("janjisuci_auth_user", JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
