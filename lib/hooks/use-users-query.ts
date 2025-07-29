import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, User, CreateUserRequest, UpdateUserRequest, UserFilters } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
  stats: () => [...usersKeys.all, 'stats'] as const,
  departments: () => [...usersKeys.all, 'departments'] as const,
  activity: (id: number) => [...usersKeys.all, 'activity', id] as const,
} as const;

// Get users with filters
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: usersKeys.list(filters || {}),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get user by ID
export function useUser(id: number) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get user statistics
export function useUserStats() {
  return useQuery({
    queryKey: usersKeys.stats(),
    queryFn: usersApi.getUserStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get departments
export function useDepartments() {
  return useQuery({
    queryKey: usersKeys.departments(),
    queryFn: usersApi.getDepartments,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get user activity
export function useUserActivity(userId: number, limit: number = 50) {
  return useQuery({
    queryKey: usersKeys.activity(userId),
    queryFn: () => usersApi.getUserActivity(userId, limit),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => usersApi.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
      
      toast({
        title: 'Usuário criado com sucesso!',
        description: `${newUser.name} foi adicionado ao sistema.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserRequest }) =>
      usersApi.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Update specific user in cache
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
      
      toast({
        title: 'Usuário atualizado!',
        description: `${updatedUser.name} foi atualizado com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: usersKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
      
      toast({
        title: 'Usuário excluído!',
        description: 'O usuário foi removido do sistema.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Toggle user status mutation
export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => usersApi.toggleUserStatus(id),
    onSuccess: (updatedUser) => {
      // Update specific user in cache
      queryClient.setQueryData(usersKeys.detail(updatedUser.id), updatedUser);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.stats() });
      
      const status = updatedUser.status === 'active' ? 'ativado' : 'desativado';
      toast({
        title: `Usuário ${status}!`,
        description: `${updatedUser.name} foi ${status} com sucesso.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao alterar status',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Reset user password mutation
export function useResetUserPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: number) => usersApi.resetUserPassword(userId),
    onSuccess: (result) => {
      toast({
        title: 'Senha resetada!',
        description: `Nova senha temporária: ${result.temporary_password}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao resetar senha',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Update profile mutation (current user)
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profileData: {
      name?: string;
      phone?: string;
      department?: string;
      bio?: string;
    }) => usersApi.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      // Update auth user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Change password mutation (current user)
export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (passwordData: {
      current_password: string;
      new_password: string;
    }) => usersApi.changePassword(passwordData),
    onSuccess: () => {
      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Senha atual incorreta',
        variant: 'destructive',
      });
    },
  });
}

// Upload avatar mutation
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: () => {
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      toast({
        title: 'Avatar atualizado!',
        description: 'Sua foto de perfil foi atualizada.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao fazer upload',
        description: error.message || 'Falha ao enviar imagem',
        variant: 'destructive',
      });
    },
  });
}

// Bulk update users mutation
export function useBulkUpdateUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      userIds,
      updates,
    }: {
      userIds: number[];
      updates: { status?: 'active' | 'inactive'; role?: string; department?: string };
    }) => usersApi.bulkUpdateUsers(userIds, updates),
    onSuccess: (result) => {
      // Invalidate all user queries
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      
      toast({
        title: 'Usuários atualizados!',
        description: `${result.updated_count} usuário(s) foram atualizados.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na atualização em lote',
        description: error.message || 'Erro interno do servidor',
        variant: 'destructive',
      });
    },
  });
}

// Export users mutation
export function useExportUsers() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (format: 'csv' | 'xlsx' = 'csv') => usersApi.exportUsers(format),
    onSuccess: (blob, format) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Exportação concluída!',
        description: 'O arquivo foi baixado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na exportação',
        description: error.message || 'Falha ao exportar dados',
        variant: 'destructive',
      });
    },
  });
}