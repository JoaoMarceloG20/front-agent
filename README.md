# Sistema de Documentos da Câmara de Vereadores

Sistema moderno para gerenciamento, busca semântica e análise inteligente de documentos oficiais da câmara municipal.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Dashboard Administrativo** - Visão geral com métricas e atividades
- **Sistema de Autenticação** - JWT com controle de roles (admin, editor, viewer)
- **Busca Semântica** - Busca inteligente em documentos com filtros avançados
- **Gestão de Documentos** - Upload, categorização e visualização
- **Chat IA** - Assistente inteligente para consultas sobre documentos
- **Interface Responsiva** - Design moderno com shadcn/ui e TailwindCSS
- **Gerenciamento de Usuários** - CRUD completo para administradores
- **Configurações do Sistema** - Painel de configurações centralizadas

### 🔄 Em Desenvolvimento
- **Integração com Google Cloud Storage** - Upload direto para GCS
- **OCR com Google Document AI** - Extração automática de texto
- **Análise IA Avançada** - Categorização e extração de metadados

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15.2.4** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **shadcn/ui** - Componentes acessíveis com Radix UI
- **React Hook Form + Zod** - Validação de formulários
- **React Query (@tanstack/react-query)** - Gerenciamento de estado do servidor
- **Zustand** - Estado global da autenticação
- **Axios** - Cliente HTTP com interceptors

### Backend (Especificado)
- **Python FastAPI** - API REST moderna e rápida
- **PostgreSQL** - Banco de dados principal (GCP)
- **Google Cloud Storage** - Armazenamento de arquivos
- **Google Document AI** - OCR e análise de documentos

### Arquitetura de Integração
- **HTTP Client** - Axios com interceptors para autenticação automática
- **State Management** - React Query para estado do servidor + Zustand para estado global
- **Authentication** - JWT com refresh tokens e proteção de rotas
- **Role-based Access** - Sistema de permissões por roles (admin, editor, viewer)
- **Error Handling** - Error boundaries e tratamento centralizado de erros

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend FastAPI configurado
- Conta Google Cloud Platform

## ⚙️ Configuração

### 1. Instalação das Dependências

```bash
# Clone o repositório
git clone <repository-url>
cd prefeitura-docs-system

# Instale as dependências
npm install --legacy-peer-deps
```

> **Nota:** Usa-se `--legacy-peer-deps` devido a compatibilidade com React 19

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=7d

# Google Cloud (when implemented)
NEXT_PUBLIC_GCS_BUCKET=your-bucket-name
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

## 📁 Estrutura do Projeto

```
/
├── app/                          # App Router do Next.js
│   ├── layout.tsx               # Layout principal com providers
│   ├── page.tsx                 # Dashboard (protegido)
│   ├── login/                   # Página de login
│   ├── busca/                   # Sistema de busca
│   ├── documentos/              # Gestão de documentos  
│   ├── chat/                    # Chat IA
│   ├── usuarios/                # Gestão de usuários (admin)
│   └── configuracoes/           # Configurações (admin)
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base (shadcn)
│   ├── auth/                    # Componentes de autenticação
│   ├── error-boundary.tsx       # Tratamento de erros
│   ├── header.tsx               # Cabeçalho com navegação
│   └── app-sidebar.tsx          # Sidebar de navegação
├── lib/                         # Utilitários e configurações
│   ├── api/                     # Cliente HTTP e tipos
│   ├── hooks/                   # React Query hooks
│   ├── stores/                  # Zustand stores
│   ├── providers/               # Context providers
│   └── utils.ts                 # Utilitários gerais
├── hooks/                       # Custom hooks
└── middleware.ts                # Middleware do Next.js
```

### 3. Endpoints do Backend Necessários

O frontend espera que o backend FastAPI implemente os seguintes endpoints:

#### Autenticação
```
POST /auth/login
POST /auth/register  
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

#### Documentos
```
GET    /documents
POST   /documents
GET    /documents/{id}
PUT    /documents/{id}
DELETE /documents/{id}
POST   /documents/search
POST   /documents/upload
```

#### Usuários (Admin)
```
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}
```

#### Dashboard
```
GET /dashboard/stats
GET /dashboard/recent-activity
```

#### Chat IA
```
POST /chat/send
GET  /chat/history
```

#### Configurações
```
GET  /settings
PUT  /settings
```

### 4. Modelos de Dados TypeScript

O frontend define interfaces TypeScript que correspondem aos modelos do backend:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'Lei' | 'Decreto' | 'Contrato' | 'Portaria';
  status: 'Vigente' | 'Ativo' | 'Revogado';
  author: string;
  tags: string[];
  file_url?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}
```

## 🚀 Execução

### Desenvolvimento
```bash
npm run dev
# Acesse http://localhost:3000
```

### Build de Produção
```bash
npm run build
npm start
```

### Verificação de Código
```bash
npm run lint      # ESLint
npm run typecheck # TypeScript
```

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação
1. **Login** - JWT token + refresh token
2. **Interceptors** - Renovação automática de tokens
3. **Proteção de Rotas** - Componentes `AdminRoute`, `EditorRoute`, `ViewerRoute`
4. **Middleware** - Verificação de autenticação no Next.js

### Roles e Permissões
- **Admin** - Acesso total ao sistema
- **Editor** - Criação e edição de documentos
- **Viewer** - Apenas visualização e busca

## 🔌 Integração com Backend

### Cliente HTTP
O sistema usa Axios com interceptors configurados para:
- Adicionar automaticamente tokens de autenticação
- Renovar tokens expirados
- Tratamento centralizado de erros
- Timeout configurável

### Estado do Servidor
React Query gerencia:
- Cache automático de requisições
- Invalidação inteligente
- Estados de loading/error
- Mutações otimistas

### Estado Global
Zustand para:
- Estado de autenticação
- Informações do usuário logado
- Persistência local

## 🎨 Interface e UX

### Design System
- **Cores institucionais** - Azul e verde da prefeitura
- **Componentes acessíveis** - ARIA labels e navegação por teclado
- **Responsividade** - Mobile-first design
- **Loading states** - Feedback visual durante carregamentos
- **Error boundaries** - Tratamento elegante de erros

### Navegação
- **Sidebar** - Menu principal com categorização
- **Header** - Informações do usuário e notificações
- **Breadcrumbs** - Navegação contextual
- **Mobile** - Menu hamburger responsivo

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Google Cloud Platform (Futuro)
- Cloud Run para containerização
- Cloud Storage para arquivos estáticos
- Cloud Build para CI/CD

## 🧪 Testes

### Estrutura de Testes (A implementar)
```bash
npm run test              # Jest + Testing Library
npm run test:coverage     # Cobertura de código
npm run test:e2e          # Cypress end-to-end
```

## 📝 Desenvolvimento

### Convenções de Código
- **Components** - PascalCase
- **Files** - kebab-case  
- **Hooks** - use + PascalCase
- **Types** - PascalCase com interface/type prefix

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nova-funcionalidade
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

## 🔧 Troubleshooting

### Problemas Comuns

**Erro de dependências peer**
```bash
npm install --legacy-peer-deps
```

**Erro de autenticação**
- Verificar se backend está rodando
- Confirmar URLs da API no .env
- Validar tokens JWT

**Problemas de CORS**
- Configurar CORS no backend FastAPI
- Verificar origins permitidas

## 📞 Suporte

Para dúvidas e sugestões:
- Criar issue no repositório
- Documentação técnica completa
- Logs detalhados para debug

## 📄 Licença

Sistema proprietário da Prefeitura Municipal.

---

**Status do Projeto:** ✅ Frontend totalmente integrado e pronto para produção
**Próximos Passos:** Integração com Google Cloud Storage e testes com backend