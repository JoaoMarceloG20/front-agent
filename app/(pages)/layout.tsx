import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import type React from "react";

export default function PagesLayout({
                                      children,
                                    }: {
  children: React.ReactNode;
}) {
  return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Coluna 1: Sidebar */}
        <AppSidebar />

        {/* Coluna 2: Header e Conteúdo Principal */}
        <div className="flex flex-col">
          <Header />
          <main
              className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto"
              role="main"
              aria-label="Conteúdo principal"
          >
            {children}
          </main>
        </div>
      </div>
  );
}