"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/state/api";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [login] = useLoginMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password });
    if (response.data) {
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });
    }
    // const res = await fetch("login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // console.log(res);
    // if (res.ok) {
    //   const data = await res.json();
    //   localStorage.setItem("token", data.token);
    //   const decoded = JSON.parse(atob(data.token.split(".")[1]));
    //   setUser({ id: decoded.userId, email: decoded.email, role: decoded.role });
    //   router.push("/");
    // } else {
    //   alert("Invalid credentials");
    // }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout, setUser }}>
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
