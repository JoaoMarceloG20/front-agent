import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Search, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buscas Realizadas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Processados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso IA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Análises bem-sucedidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-institutional-blue rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Lei Municipal 123/2024 adicionada</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-institutional-green rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Upload de 15 contratos concluído</p>
                <p className="text-xs text-muted-foreground">Há 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-institutional-blue rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Análise IA de decretos finalizada</p>
                <p className="text-xs text-muted-foreground">Há 6 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-institutional-green rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Novo usuário cadastrado</p>
                <p className="text-xs text-muted-foreground">Há 8 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Documentos por Categoria</CardTitle>
            <CardDescription>Distribuição dos documentos no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Leis</span>
              <span className="text-sm font-medium">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Decretos</span>
              <span className="text-sm font-medium">892</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Contratos</span>
              <span className="text-sm font-medium">456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Portarias</span>
              <span className="text-sm font-medium">252</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
