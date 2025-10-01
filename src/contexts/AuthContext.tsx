import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('nirikshan_auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication - in production, this would call an API
    if (email && password) {
      localStorage.setItem('nirikshan_auth', 'true');
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to Nirikshan AI Dashboard",
      });
      navigate('/dashboard');
      return true;
    }
    toast({
      variant: "destructive",
      title: "Login Failed",
      description: "Invalid credentials",
    });
    return false;
  };

  const logout = () => {
    localStorage.removeItem('nirikshan_auth');
    setIsAuthenticated(false);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
