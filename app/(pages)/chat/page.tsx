import { ChatIA } from "@/components/chat-ia"

export default function ChatPage() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assistente IA para Documentos</h2>
          <p className="text-muted-foreground">
            Faça perguntas sobre documentos municipais e obtenha análises inteligentes
          </p>
        </div>
      </div>
      <ChatIA />
    </div>
  )
}
