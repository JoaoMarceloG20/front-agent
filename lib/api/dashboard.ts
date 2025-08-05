import { apiClient } from './client';
import { DashboardStats, ActivityItem } from './types';

export const dashboardApi = {
  // Get dashboard statistics (using available endpoints)
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Use available endpoints to get stats
      const [docStats, chatMetrics] = await Promise.all([
        apiClient.get('/documents/stats'),
        apiClient.get('/chatbot/metrics')
      ]);
      
      // Combine data into dashboard format
      return {
        total_users: 0, // Not available in current API
        total_documents: docStats.data.total_documents || 0,
        searches_performed: 0, // Not available in current API
        documents_processed: docStats.data.total_documents || 0,
        ai_success_rate: 0.95, // Mock value
        recent_activity: [], // Will be populated by getRecentActivity
        documents_by_type: {
          'Lei': 0,
          'Decreto': 0,
          'Contrato': 0,
          'Portaria': 0,
          'Resolução': 0,
          'Instrução Normativa': 0,
          'Parecer': 0,
          'Ofício': 0,
        },
        documents_by_category: {},
      };
    } catch (error) {
      // Fallback to mock data if endpoints fail
      return {
        total_users: 0,
        total_documents: 0,
        searches_performed: 0,
        documents_processed: 0,
        ai_success_rate: 0.95,
        recent_activity: [],
        documents_by_type: {
          'Lei': 0,
          'Decreto': 0,
          'Contrato': 0,
          'Portaria': 0,
          'Resolução': 0,
          'Instrução Normativa': 0,
          'Parecer': 0,
          'Ofício': 0,
        },
        documents_by_category: {},
      };
    }
  },

  // Get recent activity (fallback since API doesn't have this endpoint)
  getRecentActivity: async (limit: number = 10): Promise<ActivityItem[]> => {
    // API doesn't have activity endpoint, return mock data
    return [];
  },

  // Get chart data for documents over time
  getDocumentsChart: async (period: 'week' | 'month' | 'year' = 'month'): Promise<Array<{
    date: string;
    count: number;
    type?: string;
  }>> => {
    const response = await apiClient.get('/dashboard/charts/documents', {
      params: { period },
    });
    return response.data;
  },

  // Get user activity chart
  getUserActivityChart: async (period: 'week' | 'month' | 'year' = 'month'): Promise<Array<{
    date: string;
    logins: number;
    registrations: number;
    active_users: number;
  }>> => {
    const response = await apiClient.get('/dashboard/charts/user-activity', {
      params: { period },
    });
    return response.data;
  },

  // Get search analytics
  getSearchAnalytics: async (period: 'week' | 'month' | 'year' = 'month'): Promise<{
    total_searches: number;
    avg_results_per_search: number;
    most_searched_terms: Array<{ term: string; count: number }>;
    search_trends: Array<{ date: string; count: number }>;
    success_rate: number;
  }> => {
    const response = await apiClient.get('/dashboard/search-analytics', {
      params: { period },
    });
    return response.data;
  },

  // Get system health metrics
  getSystemHealth: async (): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memory_usage: number;
    cpu_usage: number;
    disk_usage: number;
    database_connections: number;
    api_response_time: number;
    last_backup: string;
    active_users: number;
  }> => {
    const response = await apiClient.get('/dashboard/system-health');
    return response.data;
  },

  // Get storage analytics
  getStorageAnalytics: async (): Promise<{
    total_size: number;
    used_size: number;
    available_size: number;
    file_count: number;
    files_by_type: Record<string, { count: number; size: number }>;
    storage_trend: Array<{ date: string; size: number }>;
    largest_files: Array<{
      name: string;
      size: number;
      type: string;
      uploaded_at: string;
    }>;
  }> => {
    const response = await apiClient.get('/dashboard/storage-analytics');
    return response.data;
  },

  // Get user engagement metrics
  getUserEngagement: async (period: 'week' | 'month' | 'year' = 'month'): Promise<{
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    session_duration_avg: number;
    pages_per_session: number;
    bounce_rate: number;
    engagement_by_feature: Record<string, number>;
    user_retention: Array<{ period: string; retention_rate: number }>;
  }> => {
    const response = await apiClient.get('/dashboard/user-engagement', {
      params: { period },
    });
    return response.data;
  },

  // Get AI/OCR performance metrics
  getAIMetrics: async (period: 'week' | 'month' | 'year' = 'month'): Promise<{
    total_ocr_processed: number;
    ocr_success_rate: number;
    avg_processing_time: number;
    total_ai_queries: number;
    ai_response_accuracy: number;
    ai_response_time_avg: number;
    processing_by_type: Record<string, { count: number; success_rate: number }>;
    error_trends: Array<{ date: string; error_count: number; error_type: string }>;
  }> => {
    const response = await apiClient.get('/dashboard/ai-metrics', {
      params: { period },
    });
    return response.data;
  },

  // Get performance benchmarks
  getPerformanceBenchmarks: async (): Promise<{
    api_endpoints: Array<{
      endpoint: string;
      avg_response_time: number;
      requests_per_minute: number;
      error_rate: number;
    }>;
    database_queries: Array<{
      query_type: string;
      avg_execution_time: number;
      frequency: number;
    }>;
    cache_performance: {
      hit_rate: number;
      miss_rate: number;
      avg_response_time: number;
    };
  }> => {
    const response = await apiClient.get('/dashboard/performance');
    return response.data;
  },

  // Export dashboard data
  exportDashboardData: async (
    type: 'stats' | 'activity' | 'charts' | 'all' = 'all',
    format: 'json' | 'csv' | 'xlsx' = 'json'
  ): Promise<Blob> => {
    const response = await apiClient.get('/dashboard/export', {
      params: { type, format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Get custom dashboard widgets
  getCustomWidgets: async (): Promise<Array<{
    id: string;
    name: string;
    type: 'chart' | 'metric' | 'list' | 'table';
    config: Record<string, any>;
    data: any;
  }>> => {
    const response = await apiClient.get('/dashboard/widgets');
    return response.data;
  },

  // Save custom dashboard layout
  saveDashboardLayout: async (layout: Array<{
    widget_id: string;
    position: { x: number; y: number; width: number; height: number };
  }>): Promise<{ message: string }> => {
    const response = await apiClient.post('/dashboard/layout', { layout });
    return response.data;
  },
};