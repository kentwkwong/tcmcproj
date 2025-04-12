import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_API_URL,
      callback: async (response: any) => {
        try {
          const res = await axios.post(
            "/api/auth/google",
            { credential: response.credential },
            { withCredentials: true }
          );
          if (res.data?.success) {
            fetchUser(); // Refresh user state
          }
        } catch (err) {
          console.error("Google login error", err);
        }
      },
      ux_mode: "popup",
      auto_select: true,
      cancel_on_tap_outside: false,
    });
    window.google.accounts.id.prompt();
  };

  const logout = async () => {
    try {
      await axios.post(`/api/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("AuthContext.logout failed: ", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/api/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err: any) {
      console.error("Unexpected error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();

    // Load Google Identity Services script on mount
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
