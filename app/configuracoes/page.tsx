import { SettingsManager } from "@/components/settings-manager"

export default function ConfiguracoesPage() {
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
      </div>
      <SettingsManager />
    </div>
  )
}
