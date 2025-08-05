// Mock data storage
let mockConversations: any[] = [
  {
    id: 1,
    title: 'Consulta sobre Leis Municipais',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    message_count: 4,
    document_count: 2
  }
];

let mockMessages: any[] = [
  {
    id: 1,
    conversation_id: 1,
    content: 'Olá! Preciso de informações sobre as leis de trânsito municipal.',
    role: 'user',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    conversation_id: 1,
    content: 'Olá! Posso ajudá-lo com informações sobre as leis de trânsito municipal. Temos várias leis e decretos relacionados ao trânsito em nossa base de dados. Você gostaria de saber sobre algum aspecto específico?',
    role: 'assistant',
    created_at: new Date(Date.now() - 86300000).toISOString(),
    timestamp: new Date(Date.now() - 86300000).toISOString(),
    documents: ['Lei Municipal 123/2023', 'Decreto 456/2023']
  }
];

let nextConversationId = 2;
let nextMessageId = 3;

// Helper function to generate mock responses
function generateMockResponse(userMessage: string): string {
  const responses = [
    'Baseado nos documentos municipais, posso fornecer as seguintes informações...',
    'De acordo com a legislação municipal vigente, encontrei os seguintes dados relevantes...',
    'Consultando nossa base de conhecimento, posso esclarecer que...',
    'Com base nos documentos oficiais da prefeitura, a resposta é...',
    'Analisando as leis e decretos municipais, posso informar que...'
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse} Em relação à sua pergunta "${userMessage}", temos informações detalhadas em nossos documentos oficiais. Posso ajudá-lo com mais detalhes específicos se necessário.`;
}

// Mock API for testing without backend
export const mockApi = {
  // Mock authentication
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@test.com' && password === 'admin123') {
      return {
        access_token: 'mock_token_123',
        user: {
          id: 1,
          name: 'Admin Test',
          email: 'admin@test.com',
          role: 'admin',
          department: 'TI'
        }
      };
    }
    
    throw new Error('Credenciais inválidas');
  },

  // Mock health check
  health: async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  },

  // Mock chat - Send message
  sendMessage: async (request: { message: string; conversation_id?: number; context_documents?: number[] }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userMessage = {
      id: nextMessageId++,
      conversation_id: request.conversation_id || 1,
      content: request.message,
      role: 'user' as const,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    const assistantMessage = {
      id: nextMessageId++,
      conversation_id: request.conversation_id || 1,
      content: generateMockResponse(request.message),
      role: 'assistant' as const,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      documents: ['Lei Municipal 789/2024', 'Portaria 012/2024']
    };
    
    mockMessages.push(userMessage, assistantMessage);
    
    // Update conversation
    const conversation = mockConversations.find(c => c.id === (request.conversation_id || 1));
    if (conversation) {
      conversation.updated_at = new Date().toISOString();
      conversation.message_count += 2;
    }
    
    return {
      message: assistantMessage,
      conversation: conversation || mockConversations[0]
    };
  },

  // Mock chat - Get conversations
  getConversations: async (params?: { page?: number; limit?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      items: mockConversations,
      total: mockConversations.length,
      page: params?.page || 1,
      limit: params?.limit || 20,
      total_pages: 1
    };
  },

  // Mock chat - Get conversation
  getConversation: async (conversationId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const conversation = mockConversations.find(c => c.id === conversationId);
    const messages = mockMessages.filter(m => m.conversation_id === conversationId);
    return {
      conversation: conversation || mockConversations[0],
      messages
    };
  },

  // Mock chat - Get messages
  getMessages: async (conversationId: number, params?: { page?: number; limit?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const messages = mockMessages.filter(m => m.conversation_id === conversationId);
    return {
      items: messages,
      total: messages.length,
      page: params?.page || 1,
      limit: params?.limit || 20,
      total_pages: 1
    };
  },

  // Mock chat - Create conversation
  createConversation: async (title: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newConversation = {
      id: nextConversationId++,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
      document_count: 0
    };
    mockConversations.unshift(newConversation);
    return newConversation;
  },

  // Mock chat - Update conversation
  updateConversation: async (conversationId: number, updates: { title?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation && updates.title) {
      conversation.title = updates.title;
      conversation.updated_at = new Date().toISOString();
    }
    return conversation;
  },

  // Mock chat - Delete conversation
  deleteConversation: async (conversationId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockConversations = mockConversations.filter(c => c.id !== conversationId);
    mockMessages = mockMessages.filter(m => m.conversation_id !== conversationId);
  },

  // Mock chat - Delete message
  deleteMessage: async (messageId: number) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockMessages = mockMessages.filter(m => m.id !== messageId);
  },

  // Mock chat - Get AI status
  getAIStatus: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      status: 'online' as const,
      model: 'Claude 3.5 Sonnet',
      version: '2024.1',
      response_time_avg: 1200,
      success_rate: 98.5,
      last_update: new Date().toISOString()
    };
  },

  // Mock chat - Get stats
  getChatStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      total_conversations: mockConversations.length,
      total_messages: mockMessages.length,
      active_conversations: mockConversations.filter(c => 
        new Date(c.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      avg_messages_per_conversation: mockMessages.length / mockConversations.length,
      most_discussed_topics: [
        { topic: 'Leis Municipais', count: 15 },
        { topic: 'Contratos', count: 12 },
        { topic: 'Decretos', count: 8 }
      ]
    };
  },

  // Mock chat - Search
  searchChats: async (query: string, params?: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const filteredMessages = mockMessages.filter(m => 
      m.content.toLowerCase().includes(query.toLowerCase())
    );
    return {
      messages: filteredMessages,
      conversations: mockConversations.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase())
      ),
      total: filteredMessages.length
    };
  },

  // Mock chat - Export conversation
  exportConversation: async (conversationId: number, format: 'txt' | 'pdf' | 'json' = 'txt') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const conversation = mockConversations.find(c => c.id === conversationId);
    const messages = mockMessages.filter(m => m.conversation_id === conversationId);
    
    let content = '';
    if (format === 'json') {
      content = JSON.stringify({ conversation, messages }, null, 2);
    } else {
      content = `Conversa: ${conversation?.title}\n\n`;
      messages.forEach(m => {
        content += `[${m.role.toUpperCase()}] ${m.content}\n\n`;
      });
    }
    
    return new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
  },

  // Mock dashboard stats
  getStats: async () => {
    return {
      total_users: 25,
      total_documents: 150,
      total_conversations: 89,
      recent_activity: 45
    };
  },

  // Mock recent activity
  getRecentActivity: async () => {
    return [
      {
        id: 1,
        type: 'login',
        user: 'João Silva',
        description: 'Fez login no sistema',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'upload',
        user: 'Maria Santos',
        description: 'Fez upload de documento.pdf',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ];
  },

  // Mock system health
  getSystemHealth: async () => {
    return {
      status: 'healthy' as const,
      uptime: 99.9,
      memory_usage: 45.2,
      cpu_usage: 32.1,
      disk_usage: 68.5,
      database_connections: 12,
      api_response_time: 150,
      last_backup: new Date().toISOString(),
      active_users: 8
    };
  }
};

// Enable mock mode
export const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_API === 'true';