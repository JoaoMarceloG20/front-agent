// Export all API services
export { authApi } from './auth';
export { documentsApi } from './documents';
export { usersApi } from './users';
export { chatApi } from './chat';
export { dashboardApi } from './dashboard';
export { settingsApi } from './settings';

// Export API client and types
export { apiClient, fileUploadClient } from './client';
export * from './types';

// Re-export commonly used types
export type { CreateUserRequest, UpdateUserRequest, UserFilters } from './users';

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DOCUMENTS: {
    BASE: '/documents',
    SEARCH: '/documents/search',
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id: number) => `/documents/${id}/download`,
    OCR: (id: number) => `/documents/${id}/ocr`,
    CATEGORIES: '/documents/categories',
    STATS: '/documents/stats',
    RECENT: '/documents/recent',
    BY_TYPE: (type: string) => `/documents/type/${type}`,
    BY_STATUS: (status: string) => `/documents/status/${status}`,
  },
  USERS: {
    BASE: '/users',
    STATS: '/users/stats',
    SEARCH: '/users/search',
    ACTIVITY: (id: number) => `/users/${id}/activity`,
    RESET_PASSWORD: (id: number) => `/users/${id}/reset-password`,
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    AVATAR: '/users/avatar',
    DEPARTMENTS: '/users/departments',
    BULK_UPDATE: '/users/bulk-update',
    EXPORT: '/users/export',
    BY_ROLE: (role: string) => `/users/role/${role}`,
    BY_DEPARTMENT: (dept: string) => `/users/department/${encodeURIComponent(dept)}`,
  },
  CHAT: {
    BASE: '/chat',
    HISTORY: '/chat/history',
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: (conversationId: number) => `/chat/conversations/${conversationId}/messages`,
    SEARCH: '/chat/search',
    AI_STATUS: '/chat/ai-status',
    EXPORT: (conversationId: number) => `/chat/conversations/${conversationId}/export`,
    REGENERATE: (messageId: number) => `/chat/messages/${messageId}/regenerate`,
    RATE: (messageId: number) => `/chat/messages/${messageId}/rate`,
    STATS: '/chat/stats',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITY: '/dashboard/activity',
    CHARTS: {
      DOCUMENTS: '/dashboard/charts/documents',
      USER_ACTIVITY: '/dashboard/charts/user-activity',
    },
    SEARCH_ANALYTICS: '/dashboard/search-analytics',
    SYSTEM_HEALTH: '/dashboard/system-health',
    STORAGE_ANALYTICS: '/dashboard/storage-analytics',
    USER_ENGAGEMENT: '/dashboard/user-engagement',
    AI_METRICS: '/dashboard/ai-metrics',
    PERFORMANCE: '/dashboard/performance',
    EXPORT: '/dashboard/export',
    WIDGETS: '/dashboard/widgets',
    LAYOUT: '/dashboard/layout',
  },
  SETTINGS: {
    BASE: '/settings',
    SECTION: (section: string) => `/settings/${section}`,
    EXPORT: '/settings/export',
    IMPORT: '/settings/import',
    RESET: '/settings/reset',
    VALIDATE: '/settings/validate',
    HISTORY: '/settings/history',
    TEST_EMAIL: '/settings/test-email',
    TEST_STORAGE: '/settings/test-storage',
    SYSTEM_STATUS: '/settings/system-status',
    THEMES: '/settings/themes',
    UPLOAD_LOGO: '/settings/upload-logo',
    UPLOAD_FAVICON: '/settings/upload-favicon',
    BACKUP_STATUS: '/settings/backup-status',
    TRIGGER_BACKUP: '/settings/trigger-backup',
    SECURITY_AUDIT: '/settings/security-audit',
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor.',
  VALIDATION_ERROR: 'Dados inválidos.',
  FILE_TOO_LARGE: 'Arquivo muito grande.',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido.',
  UPLOAD_FAILED: 'Falha no upload do arquivo.',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: process.env.NEXT_PUBLIC_TOKEN_KEY || 'prefeitura_auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  DASHBOARD_LAYOUT: 'dashboard_layout',
} as const;