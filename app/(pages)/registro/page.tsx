import { RegisterForm } from "@/components/auth/register-form"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-institutional-blue/5 to-institutional-green/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-full shadow-lg">
              <Building2 className="h-8 w-8 text-institutional-blue" />
              <div className="text-left">
                <h1 className="text-lg font-bold text-institutional-blue">Prefeitura</h1>
                <p className="text-xs text-muted-foreground">Sistema de Documentos</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Solicitar Acesso</h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados para solicitar acesso ao sistema de documentos municipais
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-institutional-blue hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Prefeitura Municipal. Todos os direitos reservados.</p>
          <p className="mt-1">Sua solicitação será analisada pela administração</p>
        </div>
      </div>
    </div>
  )
}
