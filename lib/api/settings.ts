import { apiClient } from './client';
import { SystemSettings } from './types';

export const settingsApi = {
  // Get system settings
  getSettings: async (): Promise<SystemSettings> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  // Update system settings
  updateSettings: async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },

  // Update specific settings section
  updateSettingsSection: async <K extends keyof SystemSettings>(
    section: K,
    sectionData: Partial<SystemSettings[K]>
  ): Promise<SystemSettings[K]> => {
    const response = await apiClient.put(`/settings/${section}`, sectionData);
    return response.data;
  },

  // Export settings
  exportSettings: async (format: 'json' | 'yaml' = 'json'): Promise<Blob> => {
    const response = await apiClient.get('/settings/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Import settings
  importSettings: async (file: File): Promise<{ message: string; imported_sections: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Reset settings to default
  resetSettings: async (sections?: string[]): Promise<SystemSettings> => {
    const response = await apiClient.post('/settings/reset', {
      sections: sections || [],
    });
    return response.data;
  },

  // Validate settings
  validateSettings: async (settings: Partial<SystemSettings>): Promise<{
    valid: boolean;
    errors: Record<string, string[]>;
  }> => {
    const response = await apiClient.post('/settings/validate', settings);
    return response.data;
  },

  // Get settings history/audit log
  getSettingsHistory: async (params?: {
    section?: string;
    user_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    changes: Array<{
      id: number;
      section: string;
      field: string;
      old_value: any;
      new_value: any;
      changed_by: number;
      changed_at: string;
      reason?: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await apiClient.get('/settings/history', { params });
    return response.data;
  },

  // Test email configuration
  testEmailConfig: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/settings/test-email');
    return response.data;
  },

  // Test storage configuration
  testStorageConfig: async (): Promise<{ success: boolean; message: string; details?: any }> => {
    const response = await apiClient.post('/settings/test-storage');
    return response.data;
  },

  // Get system status based on current settings
  getSystemStatus: async (): Promise<{
    overall_status: 'healthy' | 'warning' | 'error';
    components: Array<{
      name: string;
      status: 'healthy' | 'warning' | 'error';
      message: string;
      last_check: string;
    }>;
    recommendations: string[];
  }> => {
    const response = await apiClient.get('/settings/system-status');
    return response.data;
  },

  // Get available themes
  getAvailableThemes: async (): Promise<Array<{
    id: string;
    name: string;
    description: string;
    preview_url?: string;
    is_default: boolean;
  }>> => {
    const response = await apiClient.get('/settings/themes');
    return response.data;
  },

  // Upload custom logo
  uploadLogo: async (file: File): Promise<{ logo_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/settings/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Upload favicon
  uploadFavicon: async (file: File): Promise<{ favicon_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/settings/upload-favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get backup settings and status
  getBackupStatus: async (): Promise<{
    enabled: boolean;
    last_backup: string;
    next_backup: string;
    backup_size: number;
    backup_count: number;
    retention_policy: string;
    storage_location: string;
  }> => {
    const response = await apiClient.get('/settings/backup-status');
    return response.data;
  },

  // Trigger manual backup
  triggerBackup: async (): Promise<{ message: string; backup_id: string }> => {
    const response = await apiClient.post('/settings/trigger-backup');
    return response.data;
  },

  // Get security audit
  getSecurityAudit: async (): Promise<{
    score: number;
    issues: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      category: string;
      description: string;
      recommendation: string;
    }>;
    last_audit: string;
    next_audit: string;
  }> => {
    const response = await apiClient.get('/settings/security-audit');
    return response.data;
  },
};