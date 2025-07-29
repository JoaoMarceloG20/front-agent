import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, User } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
} as const;

// Get current user query
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    enabled: authApi.isAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on 401
  });
}

// Login mutation
export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Update user data in cache
      queryClient.setQueryData(authKeys.me(), data.user);
      
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo, ${data.user.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no login',
        description: error.message || 'Credenciais inválidas',
        variant: 'destructive',
      });
    },
  });
}

// Register mutation
export function useRegister() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast({
        title: 'Registro realizado com sucesso!',
        description: 'Você pode fazer login agora.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no registro',
        description: error.message || 'Erro ao criar conta',
        variant: 'destructive',
      });
    },
  });
}

// Logout mutation
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: 'Logout realizado com sucesso!',
        description: 'Até logo!',
      });
      
      router.push('/login' as any);
    },
    onError: (error: any) => {
      // Even if logout fails, clear local data and redirect
      queryClient.clear();
      router.push('/login' as any);
    },
  });
}

// Forgot password mutation
export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Reset password mutation
export function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => 
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast({
        title: 'Senha redefinida com sucesso!',
        description: 'Você pode fazer login com sua nova senha.',
      });
      router.push('/login' as any);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao redefinir senha',
        description: error.message || 'Token inválido ou expirado',
        variant: 'destructive',
      });
    },
  });
}