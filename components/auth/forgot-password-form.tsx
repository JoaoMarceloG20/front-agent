"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simular envio do e-mail
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validação simples
      if (!email.includes("@")) {
        setError("Por favor, digite um e-mail válido.")
        return
      }

      setIsSuccess(true)
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para instruções de recuperação.",
      })
    } catch (err) {
      setError("Erro ao enviar e-mail. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">E-mail Enviado!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Enviamos as instruções de recuperação de senha para <strong>{email}</strong>
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Próximos passos:</strong>
                <br />
                1. Verifique sua caixa de entrada
                <br />
                2. Procure também na pasta de spam
                <br />
                3. Clique no link do e-mail para redefinir sua senha
                <br />
                4. O link expira em 24 horas
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail("")
                }}
                className="flex-1"
              >
                Enviar Novamente
              </Button>
              <Button asChild className="flex-1 bg-institutional-blue hover:bg-institutional-blue/90">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Login
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">Digite seu e-mail para receber as instruções</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu.email@prefeitura.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-institutional-blue hover:bg-institutional-blue/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Instruções"
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Importante:</strong> Apenas funcionários cadastrados podem recuperar a senha. Se você não tem
            acesso, solicite uma conta através da página de registro.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
