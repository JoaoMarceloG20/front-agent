import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { chatApi, ChatRequest, ChatConversation, ChatMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: number) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: number) => [...chatKeys.all, 'messages', conversationId] as const,
  stats: () => [...chatKeys.all, 'stats'] as const,
  search: (query: string, params: any) => [...chatKeys.all, 'search', query, params] as const,
  aiStatus: () => [...chatKeys.all, 'ai-status'] as const,
} as const;

// Get conversations with pagination
export function useConversations(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatApi.getConversations(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get specific conversation with messages
export function useConversation(conversationId: number) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId),
    queryFn: () => chatApi.getConversation(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Get messages from conversation with infinite scroll
export function useMessages(conversationId: number, limit: number = 20) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      chatApi.getMessages(conversationId, { page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Get chat statistics
export function useChatStats() {
  return useQuery({
    queryKey: chatKeys.stats(),
    queryFn: chatApi.getChatStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get AI status
export function useAIStatus() {
  return useQuery({
    queryKey: chatKeys.aiStatus(),
    queryFn: chatApi.getAIStatus,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

// Search in chat history
export function useChatSearch(query: string, params?: {
  conversation_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: chatKeys.search(query, params),
    queryFn: () => chatApi.searchChats(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Send message mutation (CRÍTICO)
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: ChatRequest) => chatApi.sendMessage(request),
    onSuccess: (response, variables) => {
      // Update conversation messages
      if (variables.conversation_id) {
        queryClient.invalidateQueries({ 
          queryKey: chatKeys.messages(variables.conversation_id) 
        });
        queryClient.invalidateQueries({ 
          queryKey: chatKeys.conversation(variables.conversation_id) 
        });
      }
      
      // Update conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message || 'Falha na comunicação com a IA',
        variant: 'destructive',
      });
    },
  });
}

// Create conversation mutation
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (title?: string) => chatApi.createConversation(title),
    onSuccess: (newConversation) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      
      toast({
        title: 'Nova conversa criada!',
        description: `Conversa "${newConversation.title}" foi iniciada.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar conversa',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Update conversation mutation
export function useUpdateConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { title?: string } }) =>
      chatApi.updateConversation(id, updates),
    onSuccess: (updatedConversation) => {
      // Update specific conversation in cache
      queryClient.setQueryData(
        chatKeys.conversation(updatedConversation.id),
        (old: any) => old ? { ...old, conversation: updatedConversation } : undefined
      );
      
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      
      toast({
        title: 'Conversa atualizada!',
        description: `Título alterado para "${updatedConversation.title}".`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar conversa',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Delete conversation mutation
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (conversationId: number) => chatApi.deleteConversation(conversationId),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: chatKeys.conversation(deletedId) });
      queryClient.removeQueries({ queryKey: chatKeys.messages(deletedId) });
      
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      
      toast({
        title: 'Conversa excluída!',
        description: 'A conversa foi removida do histórico.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir conversa',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Delete message mutation
export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (messageId: number) => chatApi.deleteMessage(messageId),
    onSuccess: () => {
      // Invalidate all message queries
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      
      toast({
        title: 'Mensagem excluída!',
        description: 'A mensagem foi removida da conversa.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir mensagem',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Regenerate AI response mutation
export function useRegenerateResponse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (messageId: number) => chatApi.regenerateResponse(messageId),
    onSuccess: () => {
      // Invalidate all message queries to refresh
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      
      toast({
        title: 'Resposta regenerada!',
        description: 'Uma nova resposta foi gerada pela IA.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao regenerar resposta',
        description: error.message || 'Falha na comunicação com a IA',
        variant: 'destructive',
      });
    },
  });
}

// Rate AI response mutation
export function useRateResponse() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ messageId, rating, feedback }: {
      messageId: number;
      rating: 'positive' | 'negative';
      feedback?: string;
    }) => chatApi.rateResponse(messageId, rating, feedback),
    onSuccess: () => {
      toast({
        title: 'Avaliação enviada!',
        description: 'Obrigado pelo seu feedback.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar avaliação',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Export conversation mutation
export function useExportConversation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ conversationId, format }: {
      conversationId: number;
      format?: 'txt' | 'pdf' | 'json';
    }) => chatApi.exportConversation(conversationId, format),
    onSuccess: (blob, { conversationId, format = 'txt' }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversa-${conversationId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Conversa exportada!',
        description: 'O arquivo foi baixado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Falha ao exportar conversa',
        variant: 'destructive',
      });
    },
  });
}