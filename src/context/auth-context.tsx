'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginAsUser: () => void;
  loginAsAdmin: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const loginAsUser = () => {
    setIsLoggedIn(true);
    setIsAdmin(false);
  };

  const loginAsAdmin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'admin@123') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, loginAsUser, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
