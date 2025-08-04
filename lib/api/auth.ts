import { apiClient } from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User } from './types';
import { mockApi, MOCK_MODE } from './mock';

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (MOCK_MODE) {
      const data = await mockApi.login(credentials.email, credentials.password);
      
      // Store tokens in localStorage
      localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    }
    
    const response = await apiClient.post('/auth/login', credentials);
    const data = response.data;
    
    // Store tokens in localStorage
    if (data.access_token) {
      localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  // Get current user data
  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    const user = response.data;
    
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  },

  // Refresh access token
  refresh: async (): Promise<{ access_token: string }> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const data = response.data;
    if (data.access_token) {
      localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token', data.access_token);
    }

    return data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  // Check if user is authenticated (client-side)
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Get current token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
  },
};