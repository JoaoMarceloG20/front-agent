import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, User } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
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
  getCurrentUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string, rememberMe = false) => {
        set({ isLoading: true, error: null });
        
        try {
          // Validação especial para credenciais de admin
          if (email === 'admin@admin.com' && password === 'admin123') {
            const adminUser: User = {
              id: 1,
              name: 'Administrador',
              email: 'admin@admin.com',
              role: 'admin',
              department: 'TI',
              phone: '(00) 00000-0000',
              status: 'active',
              avatar: undefined,
              created_at: new Date().toISOString()
            };
            
            // Simular token de admin
            localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token', 'admin-token-123');
            localStorage.setItem('user', JSON.stringify(adminUser));
            
            set({
              user: adminUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
          
          const response = await authApi.login({ 
            email, 
            password, 
            remember_me: rememberMe 
          });
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Erro no login',
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await authApi.register(userData);
          
          set({
            user,
            isAuthenticated: false, // User might need email verification
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Erro no registro',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authApi.logout();
        } catch (error) {
          console.warn('Logout request failed:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getCurrentUser: async () => {
        // Check if we have a token first
        if (!authApi.isAuthenticated()) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          return;
        }

        const token = authApi.getToken();
        
        // Check for admin token
        if (token === 'admin-token-123') {
          const adminUser = authApi.getCurrentUser();
          if (adminUser) {
            set({
              user: adminUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          }
        }

        set({ isLoading: true, error: null });
        
        try {
          const user = await authApi.me();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Token might be invalid, clear everything
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Don't show error for invalid token
          });
          
          // Clear tokens
          if (typeof window !== 'undefined') {
            localStorage.removeItem('prefeitura_auth_token');
            localStorage.removeItem('refresh_token');
          }
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          
          // Update localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);