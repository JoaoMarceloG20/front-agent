import { LoginForm } from "@/components/auth/login-form"
import { Building2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-institutional-blue/5 to-institutional-green/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-full shadow-lg">
              <Building2 className="h-8 w-8 text-institutional-blue" />
              <div className="text-left">
                <h1 className="text-lg font-bold text-institutional-blue">Câmara</h1>
                <p className="text-xs text-muted-foreground">Sistema de Documentos</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Acesso ao Sistema</h2>
          <p className="mt-2 text-sm text-gray-600">
            Entre com suas credenciais para acessar o sistema de documentos legislativos
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/registro" className="font-medium text-institutional-blue hover:underline">
              Solicitar acesso
            </Link>
          </p>
          <p className="text-sm">
            <Link href="/esqueceu-senha" className="text-institutional-blue hover:underline">
              Esqueceu sua senha?
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Câmara de Vereadores. Todos os direitos reservados.</p>
          <p className="mt-1">Sistema seguro e protegido</p>
        </div>
      </div>
    </div>
  )
}
