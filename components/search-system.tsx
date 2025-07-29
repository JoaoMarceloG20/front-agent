"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  ChevronDown,
  FileText,
  Calendar,
  User,
  Eye,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/components/error-boundary";
import { useDocumentSearchMutation } from '@/lib/hooks/use-documents-query'
import type { Document, DocumentType, DocumentStatus } from "@/lib/api/types";

interface SearchFilters {
  type: DocumentType | "";
  dateFrom: string;
  dateTo: string;
  author: string;
  status: DocumentStatus | "";
}

export function SearchSystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [filters, setFilters] = useState<SearchFilters>({
    type: "",
    dateFrom: "",
    dateTo: "",
    author: "",
    status: "",
  });

  const { toast } = useToast();
  const handleError = useErrorHandler();

  // Use the real search API
  const { 
    mutate: searchDocuments, 
    data: searchResults, 
    isPending: isLoading, 
    error 
  } = useDocumentSearchMutation();

  const results = searchResults?.documents || [];
  const itemsPerPage = 3;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchDocuments({
        query: searchQuery,
        type: filters.type || undefined,
        status: filters.status || undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
      });
      setCurrentPage(1);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      dateFrom: "",
      dateTo: "",
      author: "",
      status: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Barra de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca Semântica de Documentos
          </CardTitle>
          <CardDescription>
            Digite palavras-chave para encontrar documentos oficiais municipais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ex: transporte público, meio ambiente, contratos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              <ChevronDown
                className={cn(
                  "h-4 w-4 ml-2 transition-transform",
                  showFilters && "rotate-180",
                )}
              />
            </Button>
          </form>

          {/* Filtros Avançados */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4">
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de Documento
                  </label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        type: value as DocumentType | "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lei">Lei</SelectItem>
                      <SelectItem value="Decreto">Decreto</SelectItem>
                      <SelectItem value="Contrato">Contrato</SelectItem>
                      <SelectItem value="Portaria">Portaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Autor/Órgão</label>
                  <Input
                    placeholder="Ex: Câmara Municipal"
                    value={filters.author}
                    onChange={(e) =>
                      setFilters({ ...filters, author: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        status: value as DocumentStatus | "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vigente">Vigente</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Revogado">Revogado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full bg-transparent"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        {/* Header dos Resultados */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Resultados da Busca</h3>
            <Badge variant="secondary">
              {results.length} documento
              {results.length !== 1 ? "s" : ""} encontrado
              {results.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Estados de Loading e Erro */}
        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Buscando documentos...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>Erro ao buscar documentos. Tente novamente.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Resultados */}
        {!isLoading && !error && (
          <>
            {currentResults.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">
                      Nenhum documento encontrado
                    </p>
                    <p className="text-muted-foreground">
                      Tente ajustar os termos de busca ou filtros
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentResults.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{doc.type}</Badge>
                            <Badge
                              variant={
                                doc.status === "Vigente" ||
                                doc.status === "Ativo"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {doc.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">
                            {highlightText(doc.title, searchQuery)}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(doc.date).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {doc.author}
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {selectedDocument?.title}
                              </DialogTitle>
                              <DialogDescription>
                                {selectedDocument?.type} •{" "}
                                {selectedDocument?.author} •{" "}
                                {selectedDocument &&
                                  new Date(
                                    selectedDocument.date,
                                  ).toLocaleDateString("pt-BR")}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                {selectedDocument?.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="prose max-w-none">
                                <p>{selectedDocument?.content}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {highlightText(
                          doc.content.substring(0, 200) + "...",
                          searchQuery,
                        )}
                      </p>
                      <div className="flex gap-2">
                        {doc.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlightText(tag, searchQuery)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Paginação */}
            {results.length > itemsPerPage && (
              <Card>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a{" "}
                    {Math.min(endIndex, results.length)} de{" "}
                    {results.length} resultados
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
