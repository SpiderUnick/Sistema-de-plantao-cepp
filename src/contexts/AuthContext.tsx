import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulação de usuário logado
    setUser(currentUser);
    setIsAuthenticated(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login
    if (email && password) {
      setUser(currentUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    
    return user.role.permissions.some(
      permission => permission.resource === resource && permission.actions.includes(action)
    );
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
