import { apiClient } from './client';
import {
  ChatMessage,
  ChatConversation,
  ChatRequest,
  ChatResponse,
  PaginatedResponse,
} from './types';

export const chatApi = {
  // Send message to AI
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat', request);
    return response.data;
  },

  // Get conversation history
  getConversations: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatConversation>> => {
    const response = await apiClient.get('/chat/history', { params });
    return response.data;
  },

  // Get specific conversation with messages
  getConversation: async (conversationId: number): Promise<{
    conversation: ChatConversation;
    messages: ChatMessage[];
  }> => {
    const response = await apiClient.get(`/chat/${conversationId}`);
    return response.data;
  },

  // Create new conversation
  createConversation: async (title?: string): Promise<ChatConversation> => {
    const response = await apiClient.post('/chat/conversations', {
      title: title || 'Nova Conversa',
    });
    return response.data;
  },

  // Update conversation title
  updateConversation: async (
    conversationId: number,
    updates: { title?: string }
  ): Promise<ChatConversation> => {
    const response = await apiClient.put(`/chat/conversations/${conversationId}`, updates);
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId: number): Promise<void> => {
    await apiClient.delete(`/chat/conversations/${conversationId}`);
  },

  // Get messages from conversation
  getMessages: async (
    conversationId: number,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<ChatMessage>> => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`, {
      params,
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId: number): Promise<void> => {
    await apiClient.delete(`/chat/messages/${messageId}`);
  },

  // Get conversation statistics
  getChatStats: async (): Promise<{
    total_conversations: number;
    total_messages: number;
    active_conversations: number;
    avg_messages_per_conversation: number;
    most_discussed_topics: Array<{ topic: string; count: number }>;
  }> => {
    const response = await apiClient.get('/chat/stats');
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
    const response = await apiClient.get('/chat/search', {
      params: { query, ...params },
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
    const response = await apiClient.get('/chat/ai-status');
    return response.data;
  },

  // Export conversation
  exportConversation: async (
    conversationId: number,
    format: 'txt' | 'pdf' | 'json' = 'txt'
  ): Promise<Blob> => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Regenerate AI response
  regenerateResponse: async (messageId: number): Promise<ChatMessage> => {
    const response = await apiClient.post(`/chat/messages/${messageId}/regenerate`);
    return response.data;
  },

  // Rate AI response (feedback)
  rateResponse: async (
    messageId: number,
    rating: 'positive' | 'negative',
    feedback?: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(`/chat/messages/${messageId}/rate`, {
      rating,
      feedback,
    });
    return response.data;
  },
};