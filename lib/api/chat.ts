import { apiClient } from './client';
import { mockApi, MOCK_MODE } from './mock';
import type { 
  ChatMessage, 
  ChatConversation, 
  ChatRequest, 
  ChatResponse,
  PaginatedResponse,
  BaseQueryParams
} from './types';

export const chatApi = {
  // Send a message to the chatbot
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    if (MOCK_MODE) {
      return await mockApi.sendMessage(request);
    }
    
    const response = await apiClient.post('/chatbot/chat', request);
    return response.data;
  },

  // Get conversation history
  getConversations: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatConversation>> => {
    if (MOCK_MODE) {
      return await mockApi.getConversations(params);
    }
    const response = await apiClient.post('/chatbot/history', params || {});
    return response.data;
  },

  // Get specific conversation with messages
  getConversation: async (conversationId: number): Promise<{
    conversation: ChatConversation;
    messages: ChatMessage[];
  }> => {
    if (MOCK_MODE) {
      return await mockApi.getConversation(conversationId);
    }
    const response = await apiClient.get(`/chatbot/messages`);
    return response.data;
  },

  // Create new conversation
  createConversation: async (title?: string): Promise<ChatConversation> => {
    if (MOCK_MODE) {
      return await mockApi.createConversation(title || 'Nova Conversa');
    }
    const response = await apiClient.post('/auth/session', {
      title: title || 'Nova Conversa',
    });
    return response.data;
  },

  // Update conversation title
  updateConversation: async (
    conversationId: number,
    updates: { title?: string }
  ): Promise<ChatConversation> => {
    if (MOCK_MODE) {
      return await mockApi.updateConversation(conversationId, updates);
    }
    const response = await apiClient.patch(`/auth/session/${conversationId}/name`, updates);
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId: number): Promise<void> => {
    if (MOCK_MODE) {
      return await mockApi.deleteConversation(conversationId);
    }
    await apiClient.delete(`/auth/session/${conversationId}`);
  },

  // Get messages from conversation
  getMessages: async (
    conversationId: number,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<ChatMessage>> => {
    if (MOCK_MODE) {
      return await mockApi.getMessages(conversationId, params);
    }
    const response = await apiClient.get(`/chatbot/messages`, {
      params,
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: number): Promise<void> => {
    if (MOCK_MODE) {
      return await mockApi.deleteMessage(messageId);
    }
    await apiClient.delete(`/chatbot/messages/${messageId}`);
  },

  // Get conversation statistics
  getChatStats: async (): Promise<{
    total_conversations: number;
    total_messages: number;
    active_conversations: number;
    avg_messages_per_conversation: number;
    most_discussed_topics: Array<{ topic: string; count: number }>;
  }> => {
    if (MOCK_MODE) {
      return await mockApi.getChatStats();
    }
    const response = await apiClient.get('/chatbot/metrics');
    return response.data;
  },

  // Search in chat history
  searchChats: async (query: string, params?: {
    conversation_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    messages: ChatMessage[];
    conversations: ChatConversation[];
    total: number;
  }> => {
    if (MOCK_MODE) {
      return await mockApi.searchChats(query, params);
    }
    const response = await apiClient.post('/chatbot/search', {
      query, ...params
    });
    return response.data;
  },

  // Get AI model status and information
  getAIStatus: async (): Promise<{
    status: 'online' | 'offline' | 'maintenance';
    model: string;
    version: string;
    response_time_avg: number;
    success_rate: number;
    last_update: string;
  }> => {
    if (MOCK_MODE) {
      return await mockApi.getAIStatus();
    }
    const response = await apiClient.get('/chatbot/insights');
    return response.data;
  },

  // Export conversation
  exportConversation: async (
    conversationId: number,
    format: 'txt' | 'pdf' | 'json' = 'txt'
  ): Promise<Blob> => {
    if (MOCK_MODE) {
      return await mockApi.exportConversation(conversationId, format);
    }
    const response = await apiClient.post('/chatbot/export', {
      conversation_id: conversationId,
      format
    }, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Regenerate AI response
  regenerateResponse: async (messageId: number): Promise<ChatMessage> => {
    // Note: API doesn't have regenerate endpoint, would need to resend message
    throw new Error('Regenerate not supported by this API');
  },

  // Rate AI response (feedback)
  rateResponse: async (
    messageId: number,
    rating: 'positive' | 'negative',
    feedback?: string
  ): Promise<{ message: string }> => {
    // Note: API doesn't have rating endpoint
    throw new Error('Rating not supported by this API');
  },

  // Stream chat messages (for real-time responses)
  streamMessage: async (
    request: ChatRequest,
    onChunk: (chunk: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ali-api-production-459480858531.us-central1.run.app';
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'ali_auth_token')
        : null;

      const response = await fetch(`${API_BASE_URL}/api/v1/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Stream request failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete?.();
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed);
            } catch (e) {
              console.warn('Failed to parse chunk:', data);
            }
          }
        }
      }
      
      onComplete?.();
    } catch (error) {
      console.error('Stream error:', error);
      onError?.(error as Error);
    }
  },

  // Check if streaming is supported/enabled
  isStreamingEnabled: (): boolean => {
    return process.env.NEXT_PUBLIC_CHAT_STREAM_ENABLED === 'true';
  },
};