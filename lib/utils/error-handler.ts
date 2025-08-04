import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export function handleApiError(error: any): ApiError {
  // Handle Axios errors
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: data?.message || data?.detail || 'Dados inválidos fornecidos.',
          status,
          code: 'BAD_REQUEST',
          details: data
        };
      case 401:
        return {
          message: 'Sessão expirada. Faça login novamente.',
          status,
          code: 'UNAUTHORIZED'
        };
      case 403:
        return {
          message: 'Acesso negado. Você não tem permissão para esta ação.',
          status,
          code: 'FORBIDDEN'
        };
      case 404:
        return {
          message: 'Recurso não encontrado.',
          status,
          code: 'NOT_FOUND'
        };
      case 422:
        return {
          message: data?.message || data?.detail || 'Dados de entrada inválidos.',
          status,
          code: 'VALIDATION_ERROR',
          details: data?.errors || data
        };
      case 429:
        return {
          message: 'Muitas tentativas. Tente novamente em alguns minutos.',
          status,
          code: 'RATE_LIMIT'
        };
      case 500:
        return {
          message: 'Erro interno do servidor. Tente novamente mais tarde.',
          status,
          code: 'INTERNAL_ERROR'
        };
      case 502:
      case 503:
      case 504:
        return {
          message: 'Serviço temporariamente indisponível. Tente novamente.',
          status,
          code: 'SERVICE_UNAVAILABLE'
        };
      default:
        return {
          message: data?.message || data?.detail || `Erro HTTP ${status}`,
          status,
          code: 'HTTP_ERROR',
          details: data
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      status: 0,
      code: 'NETWORK_ERROR'
    };
  } else if (error.message) {
    // JavaScript error
    return {
      message: error.message,
      code: 'CLIENT_ERROR'
    };
  } else {
    // Unknown error
    return {
      message: 'Erro desconhecido. Tente novamente.',
      code: 'UNKNOWN_ERROR'
    };
  }
}

export function getErrorMessage(error: any): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

export function isNetworkError(error: any): boolean {
  const apiError = handleApiError(error);
  return apiError.code === 'NETWORK_ERROR';
}

export function isAuthError(error: any): boolean {
  const apiError = handleApiError(error);
  return apiError.code === 'UNAUTHORIZED';
}

export function isValidationError(error: any): boolean {
  const apiError = handleApiError(error);
  return apiError.code === 'VALIDATION_ERROR';
}

export function isServerError(error: any): boolean {
  const apiError = handleApiError(error);
  return apiError.status ? apiError.status >= 500 : false;
}

// Toast notification helpers
export function showErrorToast(error: any, toast?: any) {
  const apiError = handleApiError(error);
  
  if (toast) {
    toast({
      title: 'Erro',
      description: apiError.message,
      variant: 'destructive',
    });
  } else {
    console.error('API Error:', apiError);
  }
}

export function showSuccessToast(message: string, toast?: any) {
  if (toast) {
    toast({
      title: 'Sucesso',
      description: message,
      variant: 'default',
    });
  } else {
    console.log('Success:', message);
  }
}

// Retry logic for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except for 429 (rate limit)
      const apiError = handleApiError(error);
      if (apiError.status && apiError.status >= 400 && apiError.status < 500 && apiError.status !== 429) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}

// Health check utility
export async function checkApiHealth(): Promise<{
  healthy: boolean;
  status?: string;
  details?: any;
  error?: string;
}> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't wait too long for health check
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        healthy: true,
        status: data.status,
        details: data
      };
    } else {
      return {
        healthy: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    };
  }
}

// Development helpers
export function logError(error: any, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    const apiError = handleApiError(error);
    console.group(`🚨 API Error${context ? ` (${context})` : ''}`);
    console.error('Message:', apiError.message);
    console.error('Status:', apiError.status);
    console.error('Code:', apiError.code);
    if (apiError.details) {
      console.error('Details:', apiError.details);
    }
    console.error('Original Error:', error);
    console.groupEnd();
  }
}