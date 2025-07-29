import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/lib/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Sistema de Documentos - Câmara de Vereadores",
    template: "%s | Sistema de Documentos - Câmara",
  },
  description:
    "Sistema de busca semântica para documentos oficiais da câmara municipal. Acesse leis, decretos, atas e requerimentos de forma rápida e eficiente.",
  keywords: [
    "câmara de vereadores",
    "documentos legislativos",
    "leis municipais",
    "decretos",
    "atas",
    "requerimentos",
    "busca semântica",
    "poder legislativo",
  ],
  authors: [{ name: "Câmara de Vereadores" }],
  creator: "Câmara de Vereadores",
  publisher: "Câmara de Vereadores",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "Sistema de Documentos - Câmara de Vereadores",
    description:
      "Sistema de busca semântica para documentos oficiais da câmara municipal",
    siteName: "Sistema de Documentos - Câmara",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Documentos - Câmara de Vereadores",
    description:
      "Sistema de busca semântica para documentos oficiais da câmara municipal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Adicione aqui os códigos de verificação do Google, Bing, etc.
    // google: "google-site-verification-code",
    // bing: "bing-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="hsl(var(--institutional-blue))" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-background">
                <SidebarProvider defaultOpen={true}>
                  <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                    <AppSidebar />
                    <div className="flex flex-col overflow-hidden">
                      <Header />
                      <main
                        className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto"
                        role="main"
                        aria-label="Conteúdo principal"
                      >
                        {children}
                      </main>
                    </div>
                  </div>
                  <Toaster />
                </SidebarProvider>
              </div>
            </ErrorBoundary>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
