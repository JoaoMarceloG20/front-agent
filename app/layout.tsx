import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
  // ... (manter o restante dos seus metadados)
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="hsl(var(--institutional-blue))" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
      <QueryProvider>
        <AuthProvider>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </AuthProvider>
      </QueryProvider>
      </body>
      </html>
  );
}