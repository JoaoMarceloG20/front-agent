'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Send,
  Bot,
  User,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Clock,
  Hash,
  Trash2,
  Download,
  MoreVertical,
  Edit,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApiErrorBoundary } from '@/components/error-boundaries/api-error-boundary';
import { ChatMessageSkeleton } from '@/components/ui/skeleton-loaders';
import { useErrorHandler } from '@/lib/hooks/use-error-handler';
import {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useCreateConversation,
  useUpdateConversation,
  useDeleteConversation,
  useDeleteMessage,
  useExportConversation,
  useAIStatus,
} from '@/lib/hooks/use-chat-query';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  documents?: string[];
}

export function ChatIA() {
  const [inputMessage, setInputMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const handleError = useErrorHandler();

  // API Hooks
  const {
    data: conversationsResponse,
    isLoading: isLoadingConversations,
    error: conversationsError,
  } = useConversations();

  const {
    data: currentConversation,
    isLoading: isLoadingConversation,
  } = useConversation(activeConversationId || 0);

  const {
    data: messagesResponse,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
  } = useMessages(activeConversationId || 0);

  const { data: aiStatus } = useAIStatus();

  // Mutations
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();
  const updateConversationMutation = useUpdateConversation();
  const deleteConversationMutation = useDeleteConversation();
  const deleteMessageMutation = useDeleteMessage();
  const exportConversationMutation = useExportConversation();

  // Handle API errors
  React.useEffect(() => {
    if (conversationsError) {
      handleError(conversationsError);
    }
  }, [conversationsError, handleError]);

  const conversations = conversationsResponse?.items || [];
  const messages = messagesResponse?.pages.flatMap(page => page.items) || [];

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set first conversation as active if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // Handlers
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    let conversationId = activeConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      try {
        const newConversation = await createConversationMutation.mutateAsync('Nova Conversa');
        conversationId = newConversation.id;
        setActiveConversationId(conversationId);
      } catch (error) {
        return; // Error handled by mutation
      }
    }

    try {
      await sendMessageMutation.mutateAsync({
        conversation_id: conversationId,
        message: inputMessage,
        context_documents: [], // Array de IDs de documentos, se necessário
      });
      setInputMessage('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCreateNewConversation = async () => {
    try {
      const newConversation = await createConversationMutation.mutateAsync('Nova Conversa');
      setActiveConversationId(newConversation.id);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSelectConversation = (conversationId: number) => {
    setActiveConversationId(conversationId);
  };

  const handleUpdateTitle = async (conversationId: number, title: string) => {
    try {
      await updateConversationMutation.mutateAsync({
        id: conversationId,
        updates: { title },
      });
      setEditingTitle(null);
      setNewTitle('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta conversa?')) {
      try {
        await deleteConversationMutation.mutateAsync(conversationId);
        if (activeConversationId === conversationId) {
          setActiveConversationId(conversations.length > 1 ? conversations[0].id : null);
        }
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await deleteMessageMutation.mutateAsync(messageId);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleExportConversation = async (format: 'txt' | 'pdf' | 'json' = 'txt') => {
    if (!activeConversationId) return;
    
    try {
      await exportConversationMutation.mutateAsync({
        conversationId: activeConversationId,
        format,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? 's' : ''} atrás`;
    return `${Math.ceil(diffDays / 30)} mês${Math.ceil(diffDays / 30) > 1 ? 'es' : ''} atrás`;
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  if (isLoadingConversations) {
    return (
      <div className="flex h-[calc(100vh-200px)] gap-4">
        <div className="w-80 flex flex-col bg-muted/30 rounded-lg border">
          <div className="p-4">
            <ChatMessageSkeleton />
          </div>
        </div>
        <div className="flex-1">
          <ChatMessageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <ApiErrorBoundary>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        {/* Sidebar com Histórico de Conversas */}
        <div className="w-80 flex flex-col bg-muted/30 rounded-lg border">
          {/* Header da Sidebar */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Conversas</h3>
              <Button
                size="sm"
                onClick={handleCreateNewConversation}
                disabled={createConversationMutation.isPending}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleCreateNewConversation}
              disabled={createConversationMutation.isPending}
              className="w-full justify-start h-9 text-sm bg-institutional-blue hover:bg-institutional-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {createConversationMutation.isPending ? 'Criando...' : 'Nova Conversa'}
            </Button>
          </div>

          {/* Lista de Conversas */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 py-2">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  <Button
                    variant={conversation.id === activeConversationId ? 'secondary' : 'ghost'}
                    className={`w-full justify-start h-auto p-3 text-left ${
                      conversation.id === activeConversationId
                        ? 'bg-background shadow-sm'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between">
                        {editingTitle === conversation.id ? (
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => {
                              if (newTitle.trim()) {
                                handleUpdateTitle(conversation.id, newTitle.trim());
                              } else {
                                setEditingTitle(null);
                                setNewTitle('');
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                              if (e.key === 'Escape') {
                                setEditingTitle(null);
                                setNewTitle('');
                              }
                            }}
                            className="h-6 text-sm"
                            autoFocus
                          />
                        ) : (
                          <>
                            <p className="text-sm font-medium truncate pr-2">
                              {conversation.title}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(conversation.updated_at)}
                            </span>
                          </>
                        )}
                      </div>
                      {editingTitle !== conversation.id && (
                        <>
                          <p className="text-xs text-muted-foreground truncate">
                            Conversa iniciada
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {conversation.message_count || 0}
                              </span>
                            </div>
                            {conversation.document_count > 0 && (
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {conversation.document_count}
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingTitle(conversation.id);
                          setNewTitle(conversation.title);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Renomear
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportConversation('txt')}
                        disabled={exportConversationMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteConversation(conversation.id)}
                        disabled={deleteConversationMutation.isPending}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {conversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Nenhuma conversa encontrada</p>
                  <p className="text-xs">Inicie uma nova conversa</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer da Sidebar */}
          <div className="p-3 border-t bg-muted/50">
            <div className="text-xs text-muted-foreground text-center">
              {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
              {aiStatus && (
                <div className="mt-1 flex items-center justify-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${
                    aiStatus.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span>IA {aiStatus.status === 'online' ? 'Online' : 'Offline'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            {/* Header do Chat */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {activeConversation?.title || 'Nova Conversa'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    {activeConversation ? formatDate(activeConversation.updated_at) : 'Agora'}
                    <span>•</span>
                    <Hash className="h-3 w-3" />
                    {messages.length} mensagem{messages.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                {activeConversationId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleExportConversation('txt')}
                        disabled={exportConversationMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar TXT
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExportConversation('pdf')}
                        disabled={exportConversationMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            {/* Área de Mensagens */}
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
                <div className="space-y-4 py-4">
                  {/* Load more messages button */}
                  {hasNextPage && (
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        disabled={isLoadingMessages}
                      >
                        {isLoadingMessages ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Carregar mensagens anteriores
                      </Button>
                    </div>
                  )}

                  {isLoadingMessages && messages.length === 0 ? (
                    <ChatMessageSkeleton />
                  ) : (
                    messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 group ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'assistant' && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-institutional-blue text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[80%] space-y-2 ${
                          message.type === 'user' ? 'order-first' : ''
                        }`}>
                          <div className="relative">
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === 'user'
                                  ? 'bg-institutional-blue text-white ml-auto'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            
                            {/* Message actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMessage(message.id)}
                                  disabled={deleteMessageMutation.isPending}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {message.documents && message.documents.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {message.documents.map((doc: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {message.type === 'user' && (
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-institutional-blue text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Analisando documentos...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.length === 0 && !isLoadingMessages && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm mb-2">Olá! Sou a IA especializada em análise de documentos municipais.</p>
                      <p className="text-xs">Posso ajudar você a encontrar informações, fazer análises comparativas e responder perguntas sobre leis, decretos, contratos e portarias.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input de Mensagem */}
              <div className="p-6 pt-0">
                <Separator className="mb-4" />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Digite sua pergunta sobre os documentos..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={sendMessageMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={sendMessageMutation.isPending || !inputMessage.trim()}
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ApiErrorBoundary>
  );
}
