"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  FileText,
  Search,
  Settings,
  Users,
  Building2,
  MessageSquare,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/providers/auth-provider";

const menuItems = [
  {
    title: "Dashboard",
    url: "/" as const,
    icon: BarChart3,
  },
  {
    title: "Busca de Documentos",
    url: "/busca" as const,
    icon: Search,
  },
  {
    title: "Documentos",
    url: "/documentos" as const,
    icon: FileText,
  },
  {
    title: "Chat IA",
    url: "/chat" as const,
    icon: MessageSquare,
  },
  {
    title: "Upload",
    url: "/upload" as const,
    icon: Upload,
  },
];

const adminItems = [
  {
    title: "Usuários",
    url: "/usuarios" as const,
    icon: Users,
  },
  {
    title: "Configurações",
    url: "/configuracoes" as const,
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useRole();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6 text-institutional-blue" />
            <span className="text-institutional-blue">Câmara</span>
          </div>
        </div>
        <div className="flex-1">
          <ScrollArea className="h-full px-3">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <div className="py-2">
                <h4 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
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

              {isAdmin && (
                <div className="py-2">
                  <h4 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
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
              )}
            </nav>
          </ScrollArea>
        </div>
        <div className="mt-auto p-4">
          <div className="text-xs text-muted-foreground">
            © 2024 Câmara de Vereadores
          </div>
        </div>
      </div>
    </div>
  );
}
