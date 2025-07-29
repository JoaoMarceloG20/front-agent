'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    department: string;
    role: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    clearError,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hook for checking roles
export function useRole() {
  const { user, isAuthenticated } = useAuth();
  
  return {
    isAdmin: isAuthenticated && user?.role === 'admin',
    isEditor: isAuthenticated && (user?.role === 'admin' || user?.role === 'editor'),
    isViewer: isAuthenticated && user?.role === 'viewer',
    hasRole: (role: string) => isAuthenticated && user?.role === role,
    hasAnyRole: (roles: string[]) => isAuthenticated && user?.role && roles.includes(user.role),
  };
}

// Custom hook for checking permissions
export function usePermissions() {
  const { isAdmin, isEditor } = useRole();
  
  return {
    canCreate: isAdmin || isEditor,
    canEdit: isAdmin || isEditor,
    canDelete: isAdmin,
    canManageUsers: isAdmin,
    canManageSettings: isAdmin,
    canUpload: isAdmin || isEditor,
    canViewDashboard: isAdmin || isEditor,
  };
}