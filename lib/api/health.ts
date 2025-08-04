import { apiClient } from './client';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version?: string;
  uptime?: number;
  services?: {
    database?: 'healthy' | 'unhealthy';
    ai_service?: 'healthy' | 'unhealthy';
    storage?: 'healthy' | 'unhealthy';
    [key: string]: 'healthy' | 'unhealthy' | undefined;
  };
  metrics?: {
    requests_per_minute?: number;
    average_response_time?: number;
    error_rate?: number;
  };
}

export const healthApi = {
  // Check API health
  checkHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Check specific service health
  checkServiceHealth: async (serviceName: string): Promise<{
    service: string;
    status: 'healthy' | 'unhealthy';
    details?: any;
  }> => {
    const response = await apiClient.get(`/health/${serviceName}`);
    return response.data;
  },

  // Get system metrics
  getMetrics: async (): Promise<{
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    active_connections: number;
    requests_per_second: number;
  }> => {
    const response = await apiClient.get('/health/metrics');
    return response.data;
  },

  // Ping endpoint for basic connectivity check
  ping: async (): Promise<{ pong: boolean; timestamp: string }> => {
    const response = await apiClient.get('/ping');
    return response.data;
  },
};