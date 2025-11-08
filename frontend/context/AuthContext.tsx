'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// TODO: Import API
// import { authApi } from '@/lib/api/auth';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Implement auth logic
  // useEffect(() => {
  //   // Check if user is logged in on mount
  //   const checkAuth = async () => {
  //     try {
  //       const token = localStorage.getItem('accessToken');
  //       if (token) {
  //         // Verify token and get user
  //       }
  //     } catch (error) {
  //       // Handle error
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement login
    // const response = await authApi.login({ email, password });
    // localStorage.setItem('accessToken', response.accessToken);
    // localStorage.setItem('refreshToken', response.refreshToken);
    // setUser(response.user);
  };

  const register = async (data: any) => {
    // TODO: Implement register
    // const response = await authApi.register(data);
    // localStorage.setItem('accessToken', response.accessToken);
    // localStorage.setItem('refreshToken', response.refreshToken);
    // setUser(response.user);
  };

  const logout = async () => {
    // TODO: Implement logout
    // await authApi.logout();
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');
    // setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

