import { apiClient, fileUploadClient } from './client';
import {
  Document,
  DocumentCreateRequest,
  DocumentSearchRequest,
  DocumentSearchResponse,
  PaginatedResponse,
  UploadRequest,
  UploadResponse,
} from './types';

export const documentsApi = {
  // Get all documents with pagination
  getDocuments: async (params?: {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Document>> => {
    const response = await apiClient.get('/documents', { params });
    return response.data;
  },

  // Get document by ID
  getDocument: async (id: number): Promise<Document> => {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Create new document
  createDocument: async (documentData: DocumentCreateRequest): Promise<Document> => {
    const response = await apiClient.post('/documents', documentData);
    return response.data;
  },

  // Update document
  updateDocument: async (id: number, documentData: Partial<DocumentCreateRequest>): Promise<Document> => {
    const response = await apiClient.put(`/documents/${id}`, documentData);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Search documents
  searchDocuments: async (searchParams: DocumentSearchRequest): Promise<DocumentSearchResponse> => {
    const response = await apiClient.get('/documents/search', { params: searchParams });
    return response.data;
  },

  // Upload document file
  uploadDocument: async (
    uploadData: UploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    formData.append('type', uploadData.type);
    formData.append('author', uploadData.author);
    
    if (uploadData.description) {
      formData.append('description', uploadData.description);
    }
    
    if (uploadData.tags) {
      formData.append('tags', JSON.stringify(uploadData.tags));
    }

    const response = await fileUploadClient.post('/documents/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  // Download document
  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Process OCR for document
  processOCR: async (documentId: number): Promise<{ status: string; message: string }> => {
    const response = await apiClient.post(`/documents/${documentId}/ocr`);
    return response.data;
  },

  // Get document categories
  getCategories: async (): Promise<Array<{ id: string; name: string; count: number }>> => {
    const response = await apiClient.get('/documents/categories');
    return response.data;
  },

  // Get document statistics
  getDocumentStats: async (): Promise<{
    total: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    recent_count: number;
  }> => {
    const response = await apiClient.get('/documents/stats');
    return response.data;
  },

  // Bulk upload documents
  bulkUpload: async (
    files: File[],
    metadata: Array<{
      title: string;
      type: string;
      author: string;
      description?: string;
      tags?: string[];
    }>,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResponse[]> => {
    const results: UploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const meta = metadata[i];

      try {
        const result = await documentsApi.uploadDocument(
          {
            file,
            title: meta.title,
            type: meta.type as any,
            author: meta.author,
            description: meta.description,
            tags: meta.tags,
          },
          (progress) => onProgress?.(i, progress)
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
        results.push({
          id: -1,
          file_url: '',
          filename: file.name,
          size: file.size,
          mime_type: file.type,
          upload_status: 'failed',
        });
      }
    }

    return results;
  },

  // Get recent documents
  getRecentDocuments: async (limit: number = 10): Promise<Document[]> => {
    const response = await apiClient.get('/documents/recent', { params: { limit } });
    return response.data;
  },

  // Get documents by type
  getDocumentsByType: async (type: string): Promise<Document[]> => {
    const response = await apiClient.get(`/documents/type/${type}`);
    return response.data;
  },

  // Get documents by status
  getDocumentsByStatus: async (status: string): Promise<Document[]> => {
    const response = await apiClient.get(`/documents/status/${status}`);
    return response.data;
  },
};