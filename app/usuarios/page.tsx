import { UsersManager } from "@/components/users-manager";
import { AdminRoute } from "@/components/auth/protected-route";

export default function UsuariosPage() {
  return (
    <AdminRoute>
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h2>
        </div>
        <UsersManager />
      </div>
    </AdminRoute>
  );
}
