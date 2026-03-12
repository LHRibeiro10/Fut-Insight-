import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/shared/api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await api.getCurrentUser();
        if (active) {
          setUser(response.user || null);
        }
      } catch (error) {
        if (active) {
          console.error("Falha ao carregar sessao:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    const response = await api.login(credentials);
    setUser(response.user || null);
    return response.user || null;
  }

  async function register(payload) {
    const response = await api.register(payload);
    setUser(response.user || null);
    return response.user || null;
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
