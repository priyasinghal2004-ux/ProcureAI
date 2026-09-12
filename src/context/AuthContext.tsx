import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types.js";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  demoUsers: User[];
  login: (email: string, role: UserRole) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo users and active session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch("/api/auth/demo-users");
        if (res.ok) {
          const data = await res.json();
          setDemoUsers(data.users || []);

          // Check stored user or default to Government demo
          const savedUser = localStorage.getItem("procureai_user");
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          } else if (data.users && data.users.length > 0) {
            // Default to Government user for immediate seamless demo
            const govUser = data.users.find((u: User) => u.role === "government") || data.users[0];
            setCurrentUser(govUser);
            localStorage.setItem("procureai_user", JSON.stringify(govUser));
          }
        }
      } catch (err) {
        console.error("Failed to load demo users:", err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        localStorage.setItem("procureai_user", JSON.stringify(data.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setCurrentUser(result.user);
        localStorage.setItem("procureai_user", JSON.stringify(result.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("procureai_user");
  };

  const quickSwitchRole = (newRole: UserRole) => {
    const target = demoUsers.find(u => u.role === newRole);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem("procureai_user", JSON.stringify(target));
    }
  };

  const role: UserRole = currentUser?.role || "government";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        demoUsers,
        login,
        register,
        logout,
        quickSwitchRole,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
