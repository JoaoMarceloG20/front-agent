import { DocumentsManager } from "@/components/documents-manager"

export default function DocumentosPage() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Documentos</h2>
      </div>
      <DocumentsManager />
    </div>
  )
}
