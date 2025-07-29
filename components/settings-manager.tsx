"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Building2, Shield, Database, Bell, Palette, Save, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemSettings {
  general: {
    systemName: string
    organizationName: string
    description: string
    timezone: string
    language: string
    dateFormat: string
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireTwoFactor: boolean
    allowGuestAccess: boolean
    maxLoginAttempts: number
    lockoutDuration: number
  }
  storage: {
    maxFileSize: number
    allowedFileTypes: string[]
    storageQuota: number
    autoBackup: boolean
    backupFrequency: string
    retentionPeriod: number
  }
  notifications: {
    emailNotifications: boolean
    systemAlerts: boolean
    documentUpdates: boolean
    userActivity: boolean
    maintenanceAlerts: boolean
    smtpServer: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
  }
  appearance: {
    theme: string
    primaryColor: string
    logoUrl: string
    faviconUrl: string
    customCss: string
  }
}

const defaultSettings: SystemSettings = {
  general: {
    systemName: "Sistema de Documentos - Câmara",
    organizationName: "Câmara de Vereadores",
    description: "Sistema de busca semântica para documentos oficiais da câmara municipal",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    dateFormat: "DD/MM/YYYY",
  },
  security: {
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowGuestAccess: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
  },
  storage: {
    maxFileSize: 10,
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"],
    storageQuota: 1000,
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 365,
  },
  notifications: {
    emailNotifications: true,
    systemAlerts: true,
    documentUpdates: true,
    userActivity: false,
    maintenanceAlerts: true,
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
  },
  appearance: {
    theme: "light",
    primaryColor: "#1e40af",
    logoUrl: "",
    faviconUrl: "",
    customCss: "",
  },
}

export function SettingsManager() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Aqui você salvaria as configurações no backend
    console.log("Salvando configurações:", settings)
    setHasChanges(false)
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso.",
    })
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para os valores padrão.",
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "configuracoes-sistema.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Configurações exportadas",
      description: "O arquivo de configurações foi baixado com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>Gerencie as configurações globais do sistema de documentos</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configurações em Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Informações básicas do sistema e organização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Nome do Sistema</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => updateSettings("general", "systemName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nome da Organização</Label>
                  <Input
                    id="organizationName"
                    value={settings.general.organizationName}
                    onChange={(e) => updateSettings("general", "organizationName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={settings.general.description}
                  onChange={(e) => updateSettings("general", "description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                      <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSettings("general", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Formato de Data</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => updateSettings("general", "dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>Controle de acesso e políticas de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings("security", "sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings("security", "passwordMinLength", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Exigir 2FA para todos os usuários</p>
                  </div>
                  <Switch
                    checked={settings.security.requireTwoFactor}
                    onCheckedChange={(checked) => updateSettings("security", "requireTwoFactor", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Acesso de Convidados</Label>
                    <p className="text-sm text-muted-foreground">
                      Usuários não autenticados podem visualizar documentos públicos
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.allowGuestAccess}
                    onCheckedChange={(checked) => updateSettings("security", "allowGuestAccess", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Duração do Bloqueio (minutos)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSettings("security", "lockoutDuration", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Armazenamento */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações de Armazenamento
              </CardTitle>
              <CardDescription>Gerenciamento de arquivos e backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.storage.maxFileSize}
                    onChange={(e) => updateSettings("storage", "maxFileSize", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageQuota">Cota de Armazenamento (GB)</Label>
                  <Input
                    id="storageQuota"
                    type="number"
                    value={settings.storage.storageQuota}
                    onChange={(e) => updateSettings("storage", "storageQuota", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Arquivo Permitidos</Label>
                <div className="flex flex-wrap gap-2">
                  {["pdf", "doc", "docx", "xls", "xlsx", "jpg", "png", "txt"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        id={type}
                        checked={settings.storage.allowedFileTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          const newTypes = checked
                            ? [...settings.storage.allowedFileTypes, type]
                            : settings.storage.allowedFileTypes.filter((t) => t !== type)
                          updateSettings("storage", "allowedFileTypes", newTypes)
                        }}
                      />
                      <Label htmlFor={type} className="text-sm">
                        .{type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Realizar backup automático dos documentos</p>
                  </div>
                  <Switch
                    checked={settings.storage.autoBackup}
                    onCheckedChange={(checked) => updateSettings("storage", "autoBackup", checked)}
                  />
                </div>

                {settings.storage.autoBackup && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                      <Select
                        value={settings.storage.backupFrequency}
                        onValueChange={(value) => updateSettings("storage", "backupFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">A cada hora</SelectItem>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retentionPeriod">Período de Retenção (dias)</Label>
                      <Input
                        id="retentionPeriod"
                        type="number"
                        value={settings.storage.retentionPeriod}
                        onChange={(e) => updateSettings("storage", "retentionPeriod", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>Controle de alertas e notificações por e-mail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por E-mail</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificações por e-mail</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas do Sistema</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre problemas do sistema</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSettings("notifications", "systemAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizações de Documentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando documentos forem adicionados ou modificados
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.documentUpdates}
                    onCheckedChange={(checked) => updateSettings("notifications", "documentUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atividade de Usuários</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre login e ações de usuários</p>
                  </div>
                  <Switch
                    checked={settings.notifications.userActivity}
                    onCheckedChange={(checked) => updateSettings("notifications", "userActivity", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Notificar sobre manutenções programadas</p>
                  </div>
                  <Switch
                    checked={settings.notifications.maintenanceAlerts}
                    onCheckedChange={(checked) => updateSettings("notifications", "maintenanceAlerts", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Configurações SMTP</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Servidor SMTP</Label>
                    <Input
                      id="smtpServer"
                      value={settings.notifications.smtpServer}
                      onChange={(e) => updateSettings("notifications", "smtpServer", e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.notifications.smtpPort}
                      onChange={(e) => updateSettings("notifications", "smtpPort", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Usuário SMTP</Label>
                    <Input
                      id="smtpUsername"
                      value={settings.notifications.smtpUsername}
                      onChange={(e) => updateSettings("notifications", "smtpUsername", e.target.value)}
                      placeholder="usuario@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Senha SMTP</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.notifications.smtpPassword}
                      onChange={(e) => updateSettings("notifications", "smtpPassword", e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Aparência */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Configurações de Aparência
              </CardTitle>
              <CardDescription>Personalização visual do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSettings("appearance", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSettings("appearance", "primaryColor", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                    id="logoUrl"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => updateSettings("appearance", "logoUrl", e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">URL do Favicon</Label>
                  <Input
                    id="faviconUrl"
                    value={settings.appearance.faviconUrl}
                    onChange={(e) => updateSettings("appearance", "faviconUrl", e.target.value)}
                    placeholder="https://exemplo.com/favicon.ico"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCss">CSS Personalizado</Label>
                <Textarea
                  id="customCss"
                  value={settings.appearance.customCss}
                  onChange={(e) => updateSettings("appearance", "customCss", e.target.value)}
                  placeholder="/* Adicione seu CSS personalizado aqui */"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
