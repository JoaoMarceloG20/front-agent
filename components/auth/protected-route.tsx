'use client';

import { useAuth, useRole } from '@/lib/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasRole, hasAnyRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl as any);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert className="max-w-md">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para acessar esta página. 
              É necessário ter o papel de <strong>{requiredRole}</strong>.
            </AlertDescription>
          </Alert>
        </div>
      )
    );
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert className="max-w-md">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para acessar esta página. 
              São necessários um dos seguintes papéis: <strong>{requiredRoles.join(', ')}</strong>.
            </AlertDescription>
          </Alert>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Specialized components for common use cases
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function EditorRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'editor']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function ViewerRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'editor', 'viewer']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}