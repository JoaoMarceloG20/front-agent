"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileText, MoreHorizontal, Search, Download, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { DocumentTableSkeleton } from "@/components/ui/skeleton-loaders"
import { ApiErrorBoundary } from "@/components/error-boundaries/api-error-boundary"
import {
  useDocuments,
  useDocumentStats,
  useDeleteDocument,
  useDownloadDocument,
  useProcessOCR
} from "@/lib/hooks"
import { useErrorHandler } from "@/lib/hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DocumentsManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null)
  
  const handleError = useErrorHandler()
  
  // API Hooks
  const {
    data: documentsResponse,
    isLoading: documentsLoading,
    error: documentsError,
    refetch: refetchDocuments
  } = useDocuments({
    page: currentPage,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useDocumentStats()
  
  // Mutations
  const deleteDocument = useDeleteDocument()
  const downloadDocument = useDownloadDocument()
  const processOCR = useProcessOCR()
  
  // Dados dos documentos
  const documents = documentsResponse?.items || [] // Mudança: documents → items
  const totalDocuments = documentsResponse?.total || 0
  
  // Filtros locais
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = !selectedType || doc.type === selectedType
      
      return matchesSearch && matchesType
    })
  }, [documents, searchTerm, selectedType])
  
  // Handlers
  const handleDelete = async (id: number) => {
    try {
      await deleteDocument.mutateAsync(id)
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)
    } catch (error) {
      handleError(error)
    }
  }
  
  const handleDownload = async (id: number) => {
    try {
      await downloadDocument.mutateAsync(id)
    } catch (error) {
      handleError(error)
    }
  }
  
  const handleProcessOCR = async (id: number) => {
    try {
      await processOCR.mutateAsync(id)
    } catch (error) {
      handleError(error)
    }
  }
  
  const openDeleteDialog = (id: number) => {
    setDocumentToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Error handling
  if (documentsError || statsError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar documentos</AlertTitle>
          <AlertDescription>
            {(documentsError || statsError)?.message || 'Erro desconhecido'}
            <Button 
              onClick={() => {
                refetchDocuments()
              }} 
              className="mt-2"
            >
              Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Biblioteca de Documentos</CardTitle>
              <CardDescription>Gerencie todos os documentos oficiais municipais</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold">--</div>
            ) : (
              <div className="text-2xl font-bold">{stats?.total || totalDocuments}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leis</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold">--</div>
            ) : (
              <div className="text-2xl font-bold">{stats?.by_type?.Lei || documents.filter((d) => d.type === "Lei").length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decretos</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold">--</div>
            ) : (
              <div className="text-2xl font-bold">{stats?.by_type?.Decreto || documents.filter((d) => d.type === "Decreto").length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold">--</div>
            ) : (
              <div className="text-2xl font-bold">{stats?.by_type?.Contrato || documents.filter((d) => d.type === "Contrato").length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <DocumentTableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum documento encontrado com os filtros aplicados." : "Nenhum documento cadastrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.author}</TableCell>
                      <TableCell>{new Date(doc.created_at || doc.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "Vigente" || doc.status === "Ativo" ? "default" : "secondary"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.file_size || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownload(doc.id)}
                              disabled={downloadDocument.isPending}
                            >
                              {downloadDocument.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleProcessOCR(doc.id)}
                              disabled={processOCR.isPending}
                            >
                              {processOCR.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <FileText className="mr-2 h-4 w-4" />
                              )}
                              Processar OCR
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openDeleteDialog(doc.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => documentToDelete && handleDelete(documentToDelete)}
              disabled={deleteDocument.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteDocument.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
