import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { User } from "../types/User";

declare global {
  interface Window {
    google: any;
  }
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoogleCredential = async (response: any) => {
    try {
      const res = await axios.post(
        "/users/auth/google",
        { credential: response.credential },
        { withCredentials: true },
      );
      if (res.data?.success) {
        await fetchUser();
      }
    } catch (err) {
      console.error("Google login backend verification failed", err);
    }
  };

  const login = () => {
    if (window.google?.accounts?.id) {
      // FedCM prompt logic
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn(
            "FedCM NOT displayed:",
            notification.getNotDisplayedReason(),
          );
        } else if (notification.isSkippedMoment()) {
          console.warn("FedCM skipped:", notification.getSkippedReason());
        }
      });
    } else {
      console.error("Google Identity Services script not loaded yet.");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`/users/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("AuthContext.logout failed: ", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/users/gettoken`, { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      // Silent fail is usually preferred for initial check
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Load Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          // --- FEDCM SETTINGS ---
          use_fedcm_for_prompt: true,
          context: "signin",
          // ----------------------
          auto_select: false, // Set to true if you want silent re-auth
          itp_support: true,
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
