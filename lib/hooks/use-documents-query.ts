import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { documentsApi, Document, DocumentSearchRequest, DocumentCreateRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters: any) => [...documentsKeys.lists(), filters] as const,
  details: () => [...documentsKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentsKeys.details(), id] as const,
  search: (params: DocumentSearchRequest) => [...documentsKeys.all, 'search', params] as const,
  stats: () => [...documentsKeys.all, 'stats'] as const,
  categories: () => [...documentsKeys.all, 'categories'] as const,
  recent: (limit: number) => [...documentsKeys.all, 'recent', limit] as const,
} as const;

// Get documents with pagination
export function useDocuments(params?: {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: documentsKeys.list(params),
    queryFn: () => documentsApi.getDocuments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get document by ID
export function useDocument(id: number) {
  return useQuery({
    queryKey: documentsKeys.detail(id),
    queryFn: () => documentsApi.getDocument(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Search documents
export function useDocumentSearch(searchParams: DocumentSearchRequest) {
  return useQuery({
    queryKey: documentsKeys.search(searchParams),
    queryFn: () => documentsApi.searchDocuments(searchParams),
    enabled: !!(searchParams.query || searchParams.type || searchParams.status),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Search documents with mutation (for manual triggering)
export function useDocumentSearchMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (searchParams: DocumentSearchRequest) => 
      documentsApi.searchDocuments(searchParams),
    onError: (error: any) => {
      toast({
        title: 'Erro na busca',
        description: error.message || 'Erro ao buscar documentos',
        variant: 'destructive',
      });
    },
  });
}

// Infinite query for documents (for pagination)
export function useInfiniteDocuments(params?: {
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}) {
  return useInfiniteQuery({
    queryKey: documentsKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      documentsApi.getDocuments({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get document statistics
export function useDocumentStats() {
  return useQuery({
    queryKey: documentsKeys.stats(),
    queryFn: documentsApi.getDocumentStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get document categories
export function useDocumentCategories() {
  return useQuery({
    queryKey: documentsKeys.categories(),
    queryFn: documentsApi.getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get recent documents
export function useRecentDocuments(limit: number = 10) {
  return useQuery({
    queryKey: documentsKeys.recent(limit),
    queryFn: () => documentsApi.getRecentDocuments(limit),
    staleTime: 1000 * 60, // 1 minute
  });
}

// Create document mutation
export function useCreateDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: DocumentCreateRequest) => documentsApi.createDocument(data),
    onSuccess: (newDocument) => {
      // Invalidate and refetch documents
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      
      toast({
        title: 'Documento criado com sucesso!',
        description: `${newDocument.title} foi adicionado ao sistema.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar documento',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Update document mutation
export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DocumentCreateRequest> }) =>
      documentsApi.updateDocument(id, data),
    onSuccess: (updatedDocument) => {
      // Update specific document in cache
      queryClient.setQueryData(
        documentsKeys.detail(updatedDocument.id),
        updatedDocument
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
      
      toast({
        title: 'Documento atualizado!',
        description: `${updatedDocument.title} foi atualizado com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar documento',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => documentsApi.deleteDocument(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: documentsKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
      
      toast({
        title: 'Documento excluído!',
        description: 'O documento foi removido do sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir documento',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Upload document mutation
export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ 
      uploadData, 
      onProgress 
    }: { 
      uploadData: Parameters<typeof documentsApi.uploadDocument>[0]; 
      onProgress?: (progress: number) => void;
    }) => 
      documentsApi.uploadDocument(uploadData, onProgress),
    onSuccess: (result) => {
      // Invalidate documents list to show new upload
      queryClient.invalidateQueries({ queryKey: documentsKeys.all });
      
      if (result.upload_status === 'completed') {
        toast({
          title: 'Upload concluído!',
          description: `${result.filename} foi processado com sucesso.`,
        });
      } else {
        toast({
          title: 'Upload iniciado!',
          description: `${result.filename} está sendo processado.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no upload',
        description: error.message || 'Falha ao enviar arquivo',
        variant: 'destructive',
      });
    },
  });
}

// Process OCR mutation
export function useProcessOCR() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (documentId: number) => documentsApi.processOCR(documentId),
    onSuccess: (result, documentId) => {
      // Refetch document to get updated content
      queryClient.invalidateQueries({ queryKey: documentsKeys.detail(documentId) });
      
      toast({
        title: 'OCR processado!',
        description: result.message || 'Texto extraído com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no processamento OCR',
        description: error.message || 'Falha ao processar documento',
        variant: 'destructive',
      });
    },
  });
}

// Download document mutation
export function useDownloadDocument() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => documentsApi.downloadDocument(id),
    onSuccess: (blob, id) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download iniciado!',
        description: 'O arquivo está sendo baixado.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no download',
        description: error.message || 'Falha ao baixar arquivo',
        variant: 'destructive',
      });
    },
  });
}