// Base API Response
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// Error Response
export interface ApiError {
  message: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
  avatar?: string;
}

// Document Types
export interface Document {
  id: number;
  title: string;
  type: DocumentType;
  date: string;
  author: string;
  content: string;
  tags: string[];
  status: DocumentStatus;
  category?: string;
  file_url?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export type DocumentType =
  | 'Lei'
  | 'Decreto'
  | 'Contrato'
  | 'Portaria'
  | 'Resolução'
  | 'Instrução Normativa'
  | 'Parecer'
  | 'Ofício';

export type DocumentStatus =
  | 'Vigente'
  | 'Revogado'
  | 'Suspenso'
  | 'Ativo'
  | 'Inativo'
  | 'Em Análise'
  | 'Arquivado';

export interface DocumentCreateRequest {
  title: string;
  type: DocumentType;
  author: string;
  content: string;
  tags: string[];
  status: DocumentStatus;
  category?: string;
}

export interface DocumentSearchRequest {
  query?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  category?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface DocumentSearchResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Upload Types
export interface UploadRequest {
  file: File;
  title: string;
  type: DocumentType;
  author: string;
  description?: string;
  tags?: string[];
}

export interface UploadResponse {
  id: number;
  file_url: string;
  filename: string;
  size: number;
  mime_type: string;
  upload_status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Chat Types
export interface ChatMessage {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  documents?: string[];
}

export interface ChatConversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  document_count: number;
}

export interface ChatRequest {
  message: string;
  conversation_id?: number;
  context_documents?: number[];
}

export interface ChatResponse {
  message: ChatMessage;
  conversation: ChatConversation;
  context_documents?: Document[];
}

// Dashboard Types
export interface DashboardStats {
  total_documents: number;
  total_users: number;
  searches_performed: number;
  documents_processed: number;
  ai_success_rate: number;
  recent_activity: ActivityItem[];
  documents_by_type: Record<DocumentType, number>;
  documents_by_category: Record<string, number>;
}

export interface ActivityItem {
  id: number;
  type: 'document_added' | 'upload_completed' | 'analysis_completed' | 'user_registered';
  title: string;
  description?: string;
  timestamp: string;
  user_id?: number;
  document_id?: number;
}

// Settings Types
export interface SystemSettings {
  general: {
    system_name: string;
    organization_name: string;
    description: string;
    timezone: string;
    language: string;
    date_format: string;
  };
  security: {
    session_timeout: number;
    password_min_length: number;
    require_two_factor: boolean;
    allow_guest_access: boolean;
    max_login_attempts: number;
    lockout_duration: number;
  };
  storage: {
    max_file_size: number;
    allowed_file_types: string[];
    storage_quota: number;
    auto_backup: boolean;
    backup_frequency: string;
    retention_period: number;
  };
  notifications: {
    email_notifications: boolean;
    system_alerts: boolean;
    document_updates: boolean;
    user_activity: boolean;
    maintenance_alerts: boolean;
    smtp_server: string;
    smtp_port: number;
    smtp_username: string;
  };
  appearance: {
    theme: string;
    primary_color: string;
    logo_url: string;
    favicon_url: string;
    custom_css: string;
  };
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Common Query Parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}