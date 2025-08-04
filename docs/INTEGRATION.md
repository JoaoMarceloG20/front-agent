# 🔗 Integração Frontend-Backend - Ali App

## ✅ Status da Integração

**🎉 Integração Completa!** O frontend está configurado e pronto para conectar com a API Ali.

### 🛠️ Componentes Implementados

- ✅ **Cliente HTTP** com Axios e interceptors
- ✅ **Autenticação** completa (login, registro, refresh token)
- ✅ **Serviços de API** (auth, chat, documents, users, dashboard, settings)
- ✅ **Streaming de chat** para respostas em tempo real
- ✅ **Tratamento de erros** global e robusto
- ✅ **Health check** e monitoramento da API
- ✅ **Variáveis de ambiente** configuradas

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure:

```bash
cp .env.example .env.local
```

Edite as URLs conforme seu ambiente:

```bash
# Development (local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development

# Staging
NEXT_PUBLIC_API_URL=https://ali-api-staging-[hash]-uc.a.run.app
NEXT_PUBLIC_ENV=staging

# Production
NEXT_PUBLIC_API_URL=https://ali-api-production-[hash]-uc.a.run.app
NEXT_PUBLIC_ENV=production
```

### 2. Como Usar os Serviços

```typescript
import { authApi, chatApi, documentsApi, healthApi } from '@/lib/api';

// Autenticação
await authApi.login({ email, password });
const user = authApi.getCurrentUser();

// Chat
await chatApi.sendMessage({ message: 'Olá!', conversation_id: 1 });

// Chat streaming
await chatApi.streamMessage(
  { message: 'Olá!', conversation_id: 1 },
  (chunk) => console.log('Nova parte:', chunk),
  (error) => console.error('Erro:', error),
  () => console.log('Completo!')
);

// Documentos
await documentsApi.uploadDocument({ file, title, type, author });

// Health check
const health = await healthApi.checkHealth();
```

### 3. Componentes Prontos para Uso

O projeto já possui componentes funcionais em `components/`:
- `auth/` - Login, registro, recuperação de senha
- `chat-ia.tsx` - Interface de chat
- `documents-manager.tsx` - Gerenciamento de documentos
- `upload-system.tsx` - Sistema de upload
- E muito mais...

## 📡 Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Dados do usuário

### Chat
- `POST /api/v1/chat` - Enviar mensagem
- `POST /api/v1/chat/stream` - Chat streaming
- `GET /api/v1/chat/history` - Histórico
- `GET /api/v1/chat/stats` - Estatísticas

### Documentos
- `GET /api/v1/documents` - Listar documentos
- `POST /api/v1/documents/upload` - Upload
- `GET /api/v1/documents/{id}/download` - Download
- `POST /api/v1/documents/{id}/ocr` - Processar OCR

### Health Check
- `GET /health` - Status da API
- `GET /health/metrics` - Métricas do sistema
- `GET /ping` - Teste de conectividade

## 🔐 Segurança

### Token Management
- Tokens salvos com chave configurável (`NEXT_PUBLIC_TOKEN_KEY`)
- Refresh automático de tokens expirados
- Logout automático em caso de falha de autenticação

### Error Handling
- Tratamento específico por tipo de erro (400, 401, 403, 404, 500, etc.)
- Retry automático para erros de rede
- Logs detalhados em modo desenvolvimento

## 🚀 Próximos Passos

1. **Iniciar o backend** Ali na URL configurada
2. **Testar a conexão** usando `healthApi.checkHealth()`
3. **Fazer login** com as credenciais do sistema
4. **Usar os componentes** já implementados

## 🧪 Testando a Integração

```typescript
// Teste rápido da API
import { healthApi, authApi } from '@/lib/api';

// 1. Verificar se a API está online
const health = await healthApi.checkHealth();
console.log('API Status:', health.status);

// 2. Fazer login
const result = await authApi.login({
  email: 'admin@ali.com',
  password: 'senha123'
});

if (result.access_token) {
  console.log('✅ Login realizado com sucesso!');
  console.log('Usuário:', result.user);
} else {
  console.log('❌ Falha no login');
}
```

## 📱 Exemplo de Uso Completo

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/providers/auth-provider';
import { chatApi, healthApi } from '@/lib/api';

export default function ChatPage() {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Verificar status da API
    healthApi.checkHealth()
      .then(health => setApiStatus(health.status))
      .catch(() => setApiStatus('unhealthy'));
  }, []);

  const sendMessage = async (message: string) => {
    try {
      const response = await chatApi.sendMessage({
        message,
        conversation_id: null
      });
      
      setMessages(prev => [...prev, {
        role: 'user',
        content: message
      }, {
        role: 'assistant', 
        content: response.message
      }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (!isAuthenticated) {
    return <div>Por favor, faça login para usar o chat.</div>;
  }

  return (
    <div>
      <div>API Status: {apiStatus}</div>
      <div>Usuário: {user?.name}</div>
      
      {/* Componente de chat aqui */}
    </div>
  );
}
```

## 🎯 Resumo

A integração está **100% completa** e pronta para uso! Todos os serviços necessários foram implementados seguindo as melhores práticas de segurança e experiência do usuário.

O frontend agora pode:
- ✅ Conectar com a API Ali
- ✅ Autenticar usuários
- ✅ Trocar mensagens via chat (normal e streaming)
- ✅ Gerenciar documentos (upload, download, OCR)
- ✅ Monitorar a saúde da API
- ✅ Tratar erros de forma elegante
- ✅ Funcionar em todos os ambientes (dev, staging, prod)

**Próximo passo:** Inicie o backend e comece a usar! 🚀