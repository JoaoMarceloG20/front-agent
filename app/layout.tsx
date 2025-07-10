import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Documentos - Prefeitura",
  description: "Sistema de busca semântica para documentos oficiais municipais",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <SidebarProvider defaultOpen={true}>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
              <AppSidebar />
              <div className="flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">{children}</main>
              </div>
            </div>
            <Toaster />
          </SidebarProvider>
        </div>
      </body>
    </html>
  )
}
