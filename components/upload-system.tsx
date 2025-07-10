"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, ImageIcon, CheckCircle, XCircle, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  status: "pending" | "uploading" | "processing" | "completed" | "error"
  progress: number
  error?: string
  metadata?: {
    title: string
    type: string
    author: string
    description: string
  }
}

export function UploadSystem() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending",
      progress: 0,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ""),
        type: "",
        author: "",
        description: "",
      },
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const updateFileMetadata = (id: string, metadata: Partial<UploadFile["metadata"]>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, metadata: { ...file.metadata!, ...metadata } } : file)),
    )
  }

  const processFile = async (id: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status: "uploading", progress: 0 } : file)))

    // Simular upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress: i } : file)))
    }

    // Simular processamento OCR
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status: "processing" } : file)))

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Finalizar
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status: "completed", progress: 100 } : file)))
  }

  const processAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending")
    for (const file of pendingFiles) {
      await processFile(file.id)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending":
        return "Aguardando"
      case "uploading":
        return "Enviando"
      case "processing":
        return "Processando OCR"
      case "completed":
        return "Concluído"
      case "error":
        return "Erro"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Documentos
          </CardTitle>
          <CardDescription>Faça upload de documentos em lote com processamento OCR automático</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-institutional-blue bg-blue-50" : "border-muted-foreground/25",
              "hover:border-institutional-blue hover:bg-blue-50/50",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground">
                Suporte para PDF, DOC, DOCX, JPG, PNG (máx. 10MB por arquivo)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload">
              <Button className="mt-4" asChild>
                <span>Selecionar Arquivos</span>
              </Button>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Arquivos para Upload ({files.length})</CardTitle>
                <CardDescription>Configure os metadados e processe os documentos</CardDescription>
              </div>
              <Button onClick={processAllFiles} disabled={files.every((f) => f.status !== "pending")}>
                <Upload className="h-4 w-4 mr-2" />
                Processar Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="space-y-4">
                  {/* Header do arquivo */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {getStatusText(file.status)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "pending" && (
                        <Button size="sm" onClick={() => processFile(file.id)}>
                          Processar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === "uploading" || file.status === "processing"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {(file.status === "uploading" || file.status === "processing") && (
                    <Progress value={file.progress} className="w-full" />
                  )}

                  {/* Metadados */}
                  {file.status === "pending" && (
                    <>
                      <Separator />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${file.id}`}>Título do Documento</Label>
                          <Input
                            id={`title-${file.id}`}
                            value={file.metadata?.title || ""}
                            onChange={(e) => updateFileMetadata(file.id, { title: e.target.value })}
                            placeholder="Ex: Lei Municipal 123/2024"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`type-${file.id}`}>Tipo</Label>
                          <Select
                            value={file.metadata?.type || ""}
                            onValueChange={(value) => updateFileMetadata(file.id, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Lei">Lei</SelectItem>
                              <SelectItem value="Decreto">Decreto</SelectItem>
                              <SelectItem value="Contrato">Contrato</SelectItem>
                              <SelectItem value="Portaria">Portaria</SelectItem>
                              <SelectItem value="Ofício">Ofício</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`author-${file.id}`}>Autor/Órgão</Label>
                          <Input
                            id={`author-${file.id}`}
                            value={file.metadata?.author || ""}
                            onChange={(e) => updateFileMetadata(file.id, { author: e.target.value })}
                            placeholder="Ex: Câmara Municipal"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${file.id}`}>Descrição</Label>
                          <Textarea
                            id={`description-${file.id}`}
                            value={file.metadata?.description || ""}
                            onChange={(e) => updateFileMetadata(file.id, { description: e.target.value })}
                            placeholder="Breve descrição do documento"
                            rows={3}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Resultado do processamento */}
                  {file.status === "completed" && (
                    <>
                      <Separator />
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Processamento concluído com sucesso</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Documento indexado e disponível para busca semântica
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Estatísticas de Upload */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter((f) => f.status === "completed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter((f) => f.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.filter((f) => f.status === "error").length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
