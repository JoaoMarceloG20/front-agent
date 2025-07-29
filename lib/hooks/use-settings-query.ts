import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, SystemSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  settings: () => [...settingsKeys.all, 'settings'] as const,
  history: (params: any) => [...settingsKeys.all, 'history', params] as const,
  systemStatus: () => [...settingsKeys.all, 'system-status'] as const,
  themes: () => [...settingsKeys.all, 'themes'] as const,
  backupStatus: () => [...settingsKeys.all, 'backup-status'] as const,
  securityAudit: () => [...settingsKeys.all, 'security-audit'] as const,
} as const;

// Get system settings
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.settings(),
    queryFn: settingsApi.getSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get settings history
export function useSettingsHistory(params?: {
  section?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: settingsKeys.history(params),
    queryFn: () => settingsApi.getSettingsHistory(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get system status
export function useSystemStatus() {
  return useQuery({
    queryKey: settingsKeys.systemStatus(),
    queryFn: settingsApi.getSystemStatus,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

// Get available themes
export function useAvailableThemes() {
  return useQuery({
    queryKey: settingsKeys.themes(),
    queryFn: settingsApi.getAvailableThemes,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get backup status
export function useBackupStatus() {
  return useQuery({
    queryKey: settingsKeys.backupStatus(),
    queryFn: settingsApi.getBackupStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get security audit
export function useSecurityAudit() {
  return useQuery({
    queryKey: settingsKeys.securityAudit(),
    queryFn: settingsApi.getSecurityAudit,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

// Update settings mutation (CRÍTICO)
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (settings: Partial<SystemSettings>) => settingsApi.updateSettings(settings),
    onSuccess: (updatedSettings) => {
      // Update settings in cache
      queryClient.setQueryData(settingsKeys.settings(), updatedSettings);
      
      // Invalidate system status
      queryClient.invalidateQueries({ queryKey: settingsKeys.systemStatus() });
      
      toast({
        title: 'Configurações salvas!',
        description: 'As configurações do sistema foram atualizadas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar configurações',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Update settings section mutation
export function useUpdateSettingsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      section,
      data,
    }: {
      section: keyof SystemSettings;
      data: Partial<SystemSettings[keyof SystemSettings]>;
    }) => settingsApi.updateSettingsSection(section, data),
    onSuccess: (_, { section }) => {
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.systemStatus() });
      
      toast({
        title: 'Seção atualizada!',
        description: `Configurações de ${section} foram salvas.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar seção',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Reset settings mutation
export function useResetSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (sections?: string[]) => settingsApi.resetSettings(sections),
    onSuccess: (resetSettings) => {
      // Update settings in cache
      queryClient.setQueryData(settingsKeys.settings(), resetSettings);
      
      toast({
        title: 'Configurações resetadas!',
        description: 'As configurações foram restauradas para os valores padrão.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao resetar configurações',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Import settings mutation
export function useImportSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => settingsApi.importSettings(file),
    onSuccess: (result) => {
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      
      toast({
        title: 'Configurações importadas!',
        description: `${result.imported_sections.length} seção(ões) foram importadas.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na importação',
        description: error.message || 'Arquivo inválido',
        variant: 'destructive',
      });
    },
  });
}

// Export settings mutation
export function useExportSettings() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (format: 'json' | 'yaml' = 'json') => settingsApi.exportSettings(format),
    onSuccess: (blob, format) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `configuracoes-sistema.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Configurações exportadas!',
        description: 'O arquivo foi baixado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Falha ao exportar configurações',
        variant: 'destructive',
      });
    },
  });
}

// Test email configuration mutation
export function useTestEmailConfig() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsApi.testEmailConfig,
    onSuccess: (result) => {
      toast({
        title: result.success ? 'Teste bem-sucedido!' : 'Teste falhou',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no teste de email',
        description: error.message || 'Falha na comunicação',
        variant: 'destructive',
      });
    },
  });
}

// Test storage configuration mutation
export function useTestStorageConfig() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsApi.testStorageConfig,
    onSuccess: (result) => {
      toast({
        title: result.success ? 'Teste bem-sucedido!' : 'Teste falhou',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no teste de armazenamento',
        description: error.message || 'Falha na comunicação',
        variant: 'destructive',
      });
    },
  });
}

// Upload logo mutation
export function useUploadLogo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadLogo(file),
    onSuccess: () => {
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      
      toast({
        title: 'Logo atualizado!',
        description: 'O logo do sistema foi atualizado.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no upload do logo',
        description: error.message || 'Falha ao enviar arquivo',
        variant: 'destructive',
      });
    },
  });
}

// Upload favicon mutation
export function useUploadFavicon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadFavicon(file),
    onSuccess: () => {
      // Invalidate settings to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      
      toast({
        title: 'Favicon atualizado!',
        description: 'O favicon do sistema foi atualizado.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no upload do favicon',
        description: error.message || 'Falha ao enviar arquivo',
        variant: 'destructive',
      });
    },
  });
}

// Trigger backup mutation
export function useTriggerBackup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsApi.triggerBackup,
    onSuccess: (result) => {
      // Invalidate backup status
      queryClient.invalidateQueries({ queryKey: settingsKeys.backupStatus() });
      
      toast({
        title: 'Backup iniciado!',
        description: `Backup ${result.backup_id} foi iniciado.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao iniciar backup',
        description: error.message || 'Falha no sistema de backup',
        variant: 'destructive',
      });
    },
  });
}