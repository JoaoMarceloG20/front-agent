// Tipos e interfaces para documentos
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
  fileUrl?: string;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentType =
  | "Lei"
  | "Decreto"
  | "Contrato"
  | "Portaria"
  | "Resolução"
  | "Instrução Normativa"
  | "Parecer"
  | "Ofício";

export type DocumentStatus =
  | "Vigente"
  | "Revogado"
  | "Suspenso"
  | "Ativo"
  | "Inativo"
  | "Em Análise"
  | "Arquivado";

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
}

export interface DocumentStats {
  total: number;
  byType: Record<DocumentType, number>;
  byStatus: Record<DocumentStatus, number>;
  recentCount: number;
}

// Dados mockados
export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Lei Municipal nº 123/2024 - Regulamentação do Transporte Público",
    type: "Lei",
    date: "2024-01-15",
    author: "Câmara Municipal",
    content:
      "Esta lei estabelece as normas para regulamentação do sistema de transporte público municipal, definindo diretrizes para operação, fiscalização e qualidade dos serviços prestados à população. Estabelece também critérios para concessão de linhas, tarifas e padrões de qualidade.",
    tags: ["transporte", "público", "regulamentação", "mobilidade urbana"],
    status: "Vigente",
    category: "Transporte",
    fileUrl: "/documents/lei-123-2024.pdf",
    fileSize: 2048576,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: 2,
    title: "Decreto nº 456/2024 - Criação do Programa de Sustentabilidade",
    type: "Decreto",
    date: "2024-01-20",
    author: "Prefeito Municipal",
    content:
      "Decreto que institui o Programa Municipal de Sustentabilidade Ambiental, estabelecendo metas e diretrizes para preservação do meio ambiente e desenvolvimento sustentável. Define também incentivos para práticas ecológicas e penalidades para infrações ambientais.",
    tags: ["meio ambiente", "sustentabilidade", "programa", "preservação"],
    status: "Vigente",
    category: "Meio Ambiente",
    fileUrl: "/documents/decreto-456-2024.pdf",
    fileSize: 1536000,
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    title: "Contrato nº 789/2024 - Prestação de Serviços de Limpeza Urbana",
    type: "Contrato",
    date: "2024-02-01",
    author: "Secretaria de Obras",
    content:
      "Contrato para prestação de serviços de limpeza urbana, coleta de resíduos sólidos e manutenção de vias públicas no município, com vigência de 12 meses. Estabelece cronograma de coleta, equipamentos necessários e indicadores de qualidade.",
    tags: ["limpeza", "urbana", "serviços", "resíduos", "manutenção"],
    status: "Ativo",
    category: "Serviços Públicos",
    fileUrl: "/documents/contrato-789-2024.pdf",
    fileSize: 3072000,
    createdAt: "2024-02-01T10:15:00Z",
    updatedAt: "2024-02-01T10:15:00Z",
  },
  {
    id: 4,
    title: "Portaria nº 321/2024 - Horário de Funcionamento dos Órgãos Públicos",
    type: "Portaria",
    date: "2024-02-10",
    author: "Secretaria de Administração",
    content:
      "Portaria que estabelece o horário de funcionamento dos órgãos da administração pública municipal durante o período de verão, visando melhor atendimento ao público e economia de energia.",
    tags: ["horário", "funcionamento", "administração", "atendimento"],
    status: "Vigente",
    category: "Administração",
    fileUrl: "/documents/portaria-321-2024.pdf",
    fileSize: 512000,
    createdAt: "2024-02-10T16:45:00Z",
    updatedAt: "2024-02-10T16:45:00Z",
  },
  {
    id: 5,
    title: "Lei Municipal nº 124/2024 - Incentivos Fiscais para Pequenas Empresas",
    type: "Lei",
    date: "2024-02-15",
    author: "Câmara de Vereadores",
    content:
      "Lei que estabelece incentivos fiscais para micro e pequenas empresas instaladas no município, visando fomentar o desenvolvimento econômico local e a geração de empregos.",
    tags: ["incentivos", "fiscais", "empresas", "desenvolvimento", "emprego"],
    status: "Vigente",
    category: "Economia",
    fileUrl: "/documents/lei-124-2024.pdf",
    fileSize: 1843200,
    createdAt: "2024-02-15T11:20:00Z",
    updatedAt: "2024-02-15T11:20:00Z",
  },
  {
    id: 6,
    title: "Resolução nº 012/2024 - Normas para Licitações",
    type: "Resolução",
    date: "2024-02-20",
    author: "Comissão de Licitações",
    content:
      "Resolução que estabelece normas complementares para processos licitatórios no município, definindo procedimentos, prazos e critérios de avaliação para contratos públicos.",
    tags: ["licitações", "normas", "contratos", "procedimentos"],
    status: "Vigente",
    category: "Licitações",
    fileUrl: "/documents/resolucao-012-2024.pdf",
    fileSize: 2560000,
    createdAt: "2024-02-20T13:10:00Z",
    updatedAt: "2024-02-20T13:10:00Z",
  },
  {
    id: 7,
    title: "Instrução Normativa nº 003/2024 - Protocolo Digital",
    type: "Instrução Normativa",
    date: "2024-03-01",
    author: "Secretaria de Tecnologia",
    content:
      "Instrução normativa que regulamenta o uso do sistema de protocolo digital para tramitação de documentos e processos administrativos no município.",
    tags: ["protocolo", "digital", "documentos", "processos", "tecnologia"],
    status: "Vigente",
    category: "Tecnologia",
    fileUrl: "/documents/instrucao-003-2024.pdf",
    fileSize: 1024000,
    createdAt: "2024-03-01T08:30:00Z",
    updatedAt: "2024-03-01T08:30:00Z",
  },
  {
    id: 8,
    title: "Parecer Jurídico nº 045/2024 - Terceirização de Serviços",
    type: "Parecer",
    date: "2024-03-05",
    author: "Procuradoria Jurídica",
    content:
      "Parecer jurídico sobre a legalidade da terceirização de serviços não essenciais na administração pública municipal, com base na legislação vigente.",
    tags: ["parecer", "terceirização", "serviços", "legalidade", "jurídico"],
    status: "Ativo",
    category: "Jurídico",
    fileUrl: "/documents/parecer-045-2024.pdf",
    fileSize: 1536000,
    createdAt: "2024-03-05T15:45:00Z",
    updatedAt: "2024-03-05T15:45:00Z",
  },
];

export const mockCategories: DocumentCategory[] = [
  {
    id: "transporte",
    name: "Transporte",
    description: "Documentos relacionados ao transporte público e mobilidade urbana",
    color: "#3B82F6",
    count: 1,
  },
  {
    id: "meio-ambiente",
    name: "Meio Ambiente",
    description: "Legislação e normas ambientais",
    color: "#10B981",
    count: 1,
  },
  {
    id: "servicos-publicos",
    name: "Serviços Públicos",
    description: "Contratos e normas de serviços públicos",
    color: "#F59E0B",
    count: 1,
  },
  {
    id: "administracao",
    name: "Administração",
    description: "Normas administrativas e organizacionais",
    color: "#8B5CF6",
    count: 1,
  },
  {
    id: "economia",
    name: "Economia",
    description: "Legislação econômica e fiscal",
    color: "#EF4444",
    count: 1,
  },
  {
    id: "licitacoes",
    name: "Licitações",
    description: "Normas e procedimentos licitatórios",
    color: "#6B7280",
    count: 1,
  },
  {
    id: "tecnologia",
    name: "Tecnologia",
    description: "Normas e procedimentos tecnológicos",
    color: "#06B6D4",
    count: 1,
  },
  {
    id: "juridico",
    name: "Jurídico",
    description: "Pareceres e orientações jurídicas",
    color: "#DC2626",
    count: 1,
  },
];

// Funções utilitárias
export function getDocumentStats(documents: Document[] = mockDocuments): DocumentStats {
  const stats: DocumentStats = {
    total: documents.length,
    byType: {} as Record<DocumentType, number>,
    byStatus: {} as Record<DocumentStatus, number>,
    recentCount: 0,
  };

  // Inicializar contadores
  const documentTypes: DocumentType[] = ["Lei", "Decreto", "Contrato", "Portaria", "Resolução", "Instrução Normativa", "Parecer", "Ofício"];
  const documentStatuses: DocumentStatus[] = ["Vigente", "Revogado", "Suspenso", "Ativo", "Inativo", "Em Análise", "Arquivado"];

  documentTypes.forEach(type => {
    stats.byType[type] = 0;
  });

  documentStatuses.forEach(status => {
    stats.byStatus[status] = 0;
  });

  // Calcular estatísticas
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  documents.forEach(doc => {
    stats.byType[doc.type]++;
    stats.byStatus[doc.status]++;

    const docDate = new Date(doc.date);
    if (docDate >= thirtyDaysAgo) {
      stats.recentCount++;
    }
  });

  return stats;
}

export function searchDocuments(
  documents: Document[],
  query: string,
  filters?: {
    type?: DocumentType;
    status?: DocumentStatus;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Document[] {
  let filteredDocs = [...documents];

  // Aplicar filtros
  if (filters?.type) {
    filteredDocs = filteredDocs.filter(doc => doc.type === filters.type);
  }

  if (filters?.status) {
    filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
  }

  if (filters?.category) {
    filteredDocs = filteredDocs.filter(doc => doc.category === filters.category);
  }

  if (filters?.dateFrom) {
    filteredDocs = filteredDocs.filter(doc => doc.date >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    filteredDocs = filteredDocs.filter(doc => doc.date <= filters.dateTo!);
  }

  // Aplicar busca por texto
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    filteredDocs = filteredDocs.filter(doc => {
      const searchableText = [
        doc.title,
        doc.content,
        doc.author,
        doc.type,
        doc.status,
        doc.category || '',
        ...doc.tags
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  return filteredDocs;
}

export function getDocumentById(id: number, documents: Document[] = mockDocuments): Document | null {
  return documents.find(doc => doc.id === id) || null;
}

export function getDocumentsByType(type: DocumentType, documents: Document[] = mockDocuments): Document[] {
  return documents.filter(doc => doc.type === type);
}

export function getDocumentsByStatus(status: DocumentStatus, documents: Document[] = mockDocuments): Document[] {
  return documents.filter(doc => doc.status === status);
}

export function getRecentDocuments(days: number = 30, documents: Document[] = mockDocuments): Document[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return documents
    .filter(doc => new Date(doc.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Dados para dashboard
export const dashboardData = {
  totalDocuments: mockDocuments.length,
  searchesPerformed: 1234,
  documentsProcessed: 89,
  aiSuccessRate: 94.2,
  recentActivity: [
    {
      id: 1,
      type: "document_added",
      title: "Lei Municipal 123/2024 adicionada",
      time: "2 horas atrás",
      color: "institutional-blue"
    },
    {
      id: 2,
      type: "upload_completed",
      title: "Upload de 15 contratos concluído",
      time: "4 horas atrás",
      color: "institutional-green"
    },
    {
      id: 3,
      type: "analysis_completed",
      title: "Análise IA de decretos finalizada",
      time: "6 horas atrás",
      color: "institutional-blue"
    },
    {
      id: 4,
      type: "user_registered",
      title: "Novo usuário cadastrado",
      time: "8 horas atrás",
      color: "institutional-green"
    }
  ],
  documentsByCategory: {
    "Leis": 1247,
    "Decretos": 892,
    "Contratos": 456,
    "Portarias": 252
  }
};
