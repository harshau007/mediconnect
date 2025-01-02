import { decrypt, encrypt } from "@/lib/crypto";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  phone: string | null;
  setPhone: (phone: string | null) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [phone, setPhoneState] = useState<string | null>(null);

  useEffect(() => {
    const storedPhone = localStorage.getItem("authPhone");
    if (storedPhone) {
      setPhoneState(decrypt(storedPhone));
    }
  }, []);

  const setPhone = (newPhone: string | null) => {
    setPhoneState(newPhone);
    if (newPhone) {
      localStorage.setItem("authPhone", encrypt(newPhone));
    } else {
      localStorage.removeItem("authPhone");
    }
  };

  const clearAuth = () => {
    setPhoneState(null);
    localStorage.removeItem("authPhone");
  };

  return (
    <AuthContext.Provider value={{ phone, setPhone, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
