import { apiClient } from './client';
import { User, PaginatedResponse } from './types';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'editor' | 'viewer';
  department?: string;
  status?: 'active' | 'inactive';
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
}

export const usersApi = {
  // Get all users with pagination and filters
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', { params: filters });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Toggle user status (active/inactive)
  toggleUserStatus: async (id: number): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/status`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    by_role: Record<string, number>;
    by_department: Record<string, number>;
    recent_registrations: number;
  }> => {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/role/${role}`);
    return response.data;
  },

  // Get users by department
  getUsersByDepartment: async (department: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/department/${encodeURIComponent(department)}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await apiClient.get('/users/search', { params: { q: query } });
    return response.data;
  },

  // Get user activity log
  getUserActivity: async (userId: number, limit: number = 50): Promise<Array<{
    id: number;
    action: string;
    resource: string;
    timestamp: string;
    details?: string;
  }>> => {
    const response = await apiClient.get(`/users/${userId}/activity`, { params: { limit } });
    return response.data;
  },

  // Reset user password (admin only)
  resetUserPassword: async (userId: number): Promise<{ temporary_password: string }> => {
    const response = await apiClient.post(`/users/${userId}/reset-password`);
    return response.data;
  },

  // Update user profile (current user)
  updateProfile: async (profileData: {
    name?: string;
    phone?: string;
    department?: string;
    bio?: string;
  }): Promise<User> => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Change user password (current user)
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },

  // Upload user avatar
  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get departments list
  getDepartments: async (): Promise<Array<{ name: string; user_count: number }>> => {
    const response = await apiClient.get('/users/departments');
    return response.data;
  },

  // Bulk update users
  bulkUpdateUsers: async (
    userIds: number[],
    updates: { status?: 'active' | 'inactive'; role?: string; department?: string }
  ): Promise<{ updated_count: number; message: string }> => {
    const response = await apiClient.patch('/users/bulk-update', {
      user_ids: userIds,
      updates,
    });
    return response.data;
  },

  // Export users data
  exportUsers: async (format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    const response = await apiClient.get('/users/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};