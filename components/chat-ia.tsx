"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, FileText, Loader2, MessageSquare, Plus, Clock, Hash } from "lucide-react"

interface Message {
  id: number
  type: "user" | "assistant"
  content: string
  timestamp: Date
  documents?: string[]
}

const mockResponses = [
  "Com base nos documentos analisados, posso identificar que a Lei Municipal 123/2024 estabelece diretrizes claras para o transporte público. Os principais pontos incluem regulamentação de tarifas, qualidade do serviço e fiscalização.",
  "Analisando os contratos de limpeza urbana, observo que há uma padronização nos termos de prestação de serviços. Todos seguem as diretrizes municipais para coleta de resíduos sólidos.",
  "Os decretos relacionados ao meio ambiente mostram uma preocupação crescente com sustentabilidade. O Decreto 456/2024 institui o Programa de Sustentabilidade com metas específicas.",
  "Posso ajudar você a encontrar informações específicas nos documentos. Sobre qual tema você gostaria de saber mais?",
]

const mockChatHistory = [
  {
    id: 1,
    title: "Análise de Leis de Transporte Público",
    preview: "Quais são as principais leis sobre transporte público?",
    date: "Hoje",
    messageCount: 8,
    documents: 3,
    isActive: true,
  },
  {
    id: 2,
    title: "Contratos de Limpeza Urbana",
    preview: "Analise os contratos de limpeza urbana do município",
    date: "Ontem",
    messageCount: 12,
    documents: 5,
    isActive: false,
  },
  {
    id: 3,
    title: "Decretos Ambientais 2024",
    preview: "Resumo dos decretos ambientais de 2024",
    date: "2 dias atrás",
    messageCount: 6,
    documents: 2,
    isActive: false,
  },
  {
    id: 4,
    title: "Portarias de Funcionamento",
    preview: "Compare as portarias de horário de funcionamento",
    date: "3 dias atrás",
    messageCount: 10,
    documents: 4,
    isActive: false,
  },
  {
    id: 5,
    title: "Legislação Fiscal Municipal",
    preview: "Explique as mudanças na legislação fiscal",
    date: "1 semana atrás",
    messageCount: 15,
    documents: 7,
    isActive: false,
  },
  {
    id: 6,
    title: "Análise de Orçamento 2024",
    preview: "Detalhamento do orçamento municipal para 2024",
    date: "1 semana atrás",
    messageCount: 9,
    documents: 3,
    isActive: false,
  },
  {
    id: 7,
    title: "Regulamentações de Saúde",
    preview: "Normas sanitárias e regulamentações de saúde",
    date: "2 semanas atrás",
    messageCount: 14,
    documents: 6,
    isActive: false,
  },
  {
    id: 8,
    title: "Políticas de Educação",
    preview: "Diretrizes educacionais do município",
    date: "2 semanas atrás",
    messageCount: 11,
    documents: 4,
    isActive: false,
  },
  {
    id: 9,
    title: "Contratos de Obras Públicas",
    preview: "Análise dos contratos de infraestrutura",
    date: "3 semanas atrás",
    messageCount: 18,
    documents: 8,
    isActive: false,
  },
  {
    id: 10,
    title: "Licenças Ambientais",
    preview: "Processos de licenciamento ambiental",
    date: "1 mês atrás",
    messageCount: 7,
    documents: 2,
    isActive: false,
  },
]

export function ChatIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content:
        "Olá! Sou a IA especializada em análise de documentos municipais. Posso ajudar você a encontrar informações, fazer análises comparativas e responder perguntas sobre leis, decretos, contratos e portarias. Como posso ajudar?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeChat, setActiveChat] = useState(1)
  const [chatHistory, setChatHistory] = useState(mockChatHistory)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simular resposta da IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: messages.length + 2,
        type: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
        documents: ["Lei Municipal 123/2024", "Decreto 456/2024"],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const loadChat = (chatId: number) => {
    // Atualizar chat ativo
    setChatHistory((prev) =>
      prev.map((chat) => ({
        ...chat,
        isActive: chat.id === chatId,
      })),
    )
    setActiveChat(chatId)

    // Simular carregamento de mensagens da conversa
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      console.log(`Carregando conversa: ${chat.title}`)
      // Aqui você carregaria as mensagens reais da conversa
      // Por enquanto, mantemos as mensagens atuais
    }
  }

  const createNewChat = () => {
    const newChatId = Math.max(...chatHistory.map((c) => c.id)) + 1
    const newChat = {
      id: newChatId,
      title: "Nova Conversa",
      preview: "Conversa iniciada",
      date: "Agora",
      messageCount: 1,
      documents: 0,
      isActive: true,
    }

    setChatHistory((prev) => [newChat, ...prev.map((chat) => ({ ...chat, isActive: false }))])
    setActiveChat(newChatId)

    // Resetar mensagens para nova conversa
    setMessages([
      {
        id: 1,
        type: "assistant",
        content: "Olá! Como posso ajudar você com os documentos municipais?",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Sidebar com Histórico de Conversas */}
      <div className="w-80 flex flex-col bg-muted/30 rounded-lg border">
        {/* Header da Sidebar */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Conversas</h3>
            <Button size="sm" onClick={createNewChat} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={createNewChat}
            className="w-full justify-start h-9 text-sm bg-institutional-blue hover:bg-institutional-blue/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>

        {/* Lista de Conversas */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {chatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant={chat.isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-auto p-3 text-left ${
                  chat.isActive ? "bg-background shadow-sm" : "hover:bg-muted/50"
                }`}
                onClick={() => loadChat(chat.id)}
              >
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate pr-2">{chat.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{chat.messageCount}</span>
                    </div>
                    {chat.documents > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{chat.documents}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}

            {chatHistory.length === 0 && (
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
            {chatHistory.length} conversa{chatHistory.length !== 1 ? "s" : ""}
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
                  {chatHistory.find((c) => c.isActive)?.title || "Nova Conversa"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  {chatHistory.find((c) => c.isActive)?.date || "Agora"}
                  <span>•</span>
                  <Hash className="h-3 w-3" />
                  {messages.length} mensagem{messages.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Área de Mensagens */}
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-institutional-blue text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] space-y-2 ${message.type === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user" ? "bg-institutional-blue text-white ml-auto" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.documents && (
                        <div className="flex flex-wrap gap-1">
                          {message.documents.map((doc, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.type === "user" && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
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
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
