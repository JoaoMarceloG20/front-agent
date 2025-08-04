'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Search, TrendingUp, AlertCircle } from "lucide-react"
import { useDashboardStats, useRecentActivity } from "@/lib/hooks"
import { Loading } from "@/components/ui/loading"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ViewerRoute } from "@/components/auth/protected-route"
import ApiTest from "@/components/api-test"

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activity, isLoading: activityLoading, error: activityError } = useRecentActivity(4);
  // Show loading state
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" text="Carregando dashboard..." />
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ViewerRoute>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_documents || 0}</div>
            <p className="text-xs text-muted-foreground">Documentos no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buscas Realizadas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.searches_performed || 0}</div>
            <p className="text-xs text-muted-foreground">Total de buscas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Processados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.documents_processed || 0}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso IA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.ai_success_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">Análises bem-sucedidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading text="Carregando atividades..." />
              </div>
            ) : activityError ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                Erro ao carregar atividades
              </div>
            ) : activity && activity.length > 0 ? (
              activity.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'document_added' ? 'bg-institutional-blue' :
                    item.type === 'upload_completed' ? 'bg-institutional-green' :
                    item.type === 'analysis_completed' ? 'bg-institutional-blue' :
                    'bg-institutional-green'
                  }`}></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.timestamp), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos por Tipo</CardTitle>
            <CardDescription>Distribuição dos documentos no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.documents_by_type ? (
              Object.entries(stats.documents_by_type).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Dados não disponíveis
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* API Test Component - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <ApiTest />
        </div>
      )}
      </div>
    </ViewerRoute>
  )
}
