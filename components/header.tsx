"use client"

import { Bell, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, FileText, Search, Settings, Users, Building2, MessageSquare, Upload } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Busca de Documentos",
    url: "/busca",
    icon: Search,
  },
  {
    title: "Documentos",
    url: "/documentos",
    icon: FileText,
  },
  {
    title: "Chat IA",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: Upload,
  },
]

const adminItems = [
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Limpar dados de sessão/localStorage se houver
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    // Redirecionar para página de login
    router.push("/login")

    // Opcional: mostrar toast de confirmação
    // toast({ title: "Logout realizado", description: "Você foi desconectado com sucesso." })
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6 text-institutional-blue" />
            <span className="text-institutional-blue">Prefeitura</span>
          </div>
          <nav className="grid gap-2 text-lg font-medium">
            <div className="py-2">
              <h4 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Menu Principal
              </h4>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                      pathname === item.url ? "bg-muted text-primary" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <h4 className="mb-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Administração
              </h4>
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                      pathname === item.url ? "bg-muted text-primary" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">Sistema de Documentos</h1>
      </div>

      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 z-[100]">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Novo documento adicionado</p>
                <p className="text-xs text-muted-foreground">Lei Municipal 123/2024 foi publicada</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Upload concluído</p>
                <p className="text-xs text-muted-foreground">5 documentos processados com sucesso</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Análise IA disponível</p>
                <p className="text-xs text-muted-foreground">Relatório de contratos foi analisado</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative z-10">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-[100]">
            <DropdownMenuLabel>João Silva</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Administrador</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="cursor-pointer">
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes" className="cursor-pointer">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
