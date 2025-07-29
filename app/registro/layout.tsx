import type React from "react";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            {children}
            <Toaster />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  );
}