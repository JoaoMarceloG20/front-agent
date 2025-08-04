import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1`,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      // Get token from localStorage or cookies
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized - token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await client.post('/auth/refresh', {
              refresh_token: refreshToken,
            });

            const { access_token } = response.data;
            localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token', access_token);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network Error:', error.message);
        return Promise.reject({
          message: 'Erro de conexão. Verifique sua internet.',
          status: 0,
        });
      }

      // Handle server errors
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Erro desconhecido';

      return Promise.reject({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  );

  return client;
};

// Create and export the API client
export const apiClient = createApiClient();

// Helper function for file uploads
export const createFileUploadClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1`,
    timeout: 300000, // 5 minutes for file uploads
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Add auth token for file uploads
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client;
};

export const fileUploadClient = createFileUploadClient();