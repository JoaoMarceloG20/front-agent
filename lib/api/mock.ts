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

  // Mock chat
  sendMessage: async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      message: `Mock response to: "${message}"`,
      session_id: 'mock_session_123'
    };
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