import { useQuery, useMutation } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activity: (limit: number) => [...dashboardKeys.all, 'activity', limit] as const,
  charts: {
    documents: (period: string) => [...dashboardKeys.all, 'charts', 'documents', period] as const,
    userActivity: (period: string) => [...dashboardKeys.all, 'charts', 'user-activity', period] as const,
  },
  searchAnalytics: (period: string) => [...dashboardKeys.all, 'search-analytics', period] as const,
  systemHealth: () => [...dashboardKeys.all, 'system-health'] as const,
  storageAnalytics: () => [...dashboardKeys.all, 'storage-analytics'] as const,
  userEngagement: (period: string) => [...dashboardKeys.all, 'user-engagement', period] as const,
  aiMetrics: (period: string) => [...dashboardKeys.all, 'ai-metrics', period] as const,
  performance: () => [...dashboardKeys.all, 'performance'] as const,
  widgets: () => [...dashboardKeys.all, 'widgets'] as const,
} as const;

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardApi.getStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// Get recent activity
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.activity(limit),
    queryFn: () => dashboardApi.getRecentActivity(limit),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}

// Get documents chart data
export function useDocumentsChart(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: dashboardKeys.charts.documents(period),
    queryFn: () => dashboardApi.getDocumentsChart(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user activity chart data
export function useUserActivityChart(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: dashboardKeys.charts.userActivity(period),
    queryFn: () => dashboardApi.getUserActivityChart(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get search analytics
export function useSearchAnalytics(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: dashboardKeys.searchAnalytics(period),
    queryFn: () => dashboardApi.getSearchAnalytics(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get system health
export function useSystemHealth() {
  return useQuery({
    queryKey: dashboardKeys.systemHealth(),
    queryFn: dashboardApi.getSystemHealth,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

// Get storage analytics
export function useStorageAnalytics() {
  return useQuery({
    queryKey: dashboardKeys.storageAnalytics(),
    queryFn: dashboardApi.getStorageAnalytics,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get user engagement metrics
export function useUserEngagement(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: dashboardKeys.userEngagement(period),
    queryFn: () => dashboardApi.getUserEngagement(period),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get AI/OCR metrics
export function useAIMetrics(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: dashboardKeys.aiMetrics(period),
    queryFn: () => dashboardApi.getAIMetrics(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get performance benchmarks
export function usePerformanceBenchmarks() {
  return useQuery({
    queryKey: dashboardKeys.performance(),
    queryFn: dashboardApi.getPerformanceBenchmarks,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Get custom widgets
export function useCustomWidgets() {
  return useQuery({
    queryKey: dashboardKeys.widgets(),
    queryFn: dashboardApi.getCustomWidgets,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Export dashboard data mutation
export function useExportDashboardData() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      type,
      format,
    }: {
      type?: 'stats' | 'activity' | 'charts' | 'all';
      format?: 'json' | 'csv' | 'xlsx';
    }) => dashboardApi.exportDashboardData(type, format),
    onSuccess: (blob, { type, format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${type}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Exportação concluída!',
        description: 'Os dados do dashboard foram exportados.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Falha ao exportar dados',
        variant: 'destructive',
      });
    },
  });
}

// Save dashboard layout mutation
export function useSaveDashboardLayout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (layout: Array<{
      widget_id: string;
      position: { x: number; y: number; width: number; height: number };
    }>) => dashboardApi.saveDashboardLayout(layout),
    onSuccess: () => {
      toast({
        title: 'Layout salvo!',
        description: 'O layout do dashboard foi atualizado.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar layout',
        description: error.message || 'Falha ao salvar configuração',
        variant: 'destructive',
      });
    },
  });
}

// Combined dashboard data hook (for loading multiple data sources)
export function useDashboardData() {
  const stats = useDashboardStats();
  const activity = useRecentActivity(10);
  const systemHealth = useSystemHealth();
  
  return {
    stats,
    activity,
    systemHealth,
    isLoading: stats.isLoading || activity.isLoading || systemHealth.isLoading,
    error: stats.error || activity.error || systemHealth.error,
    refetch: () => {
      stats.refetch();
      activity.refetch();
      systemHealth.refetch();
    },
  };
}