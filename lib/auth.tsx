'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decoded = jwtDecode<User>(storedToken);
        setUser(decoded);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Invalid token on initial load');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    try {
      const decoded = jwtDecode<User>(newToken);
      setUser(decoded);
      setToken(newToken);
      router.push('/dashboard');
    } catch (error) {
      console.error('Invalid token on login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
