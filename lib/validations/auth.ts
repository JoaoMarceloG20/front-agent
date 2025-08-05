import { z } from "zod";

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .refine((email) => email.endsWith("@camara.gov.br") || email === "admin@admin.com", {
      message: "E-mail deve ser do domínio @camara.gov.br",
    }),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

// Schema para registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .refine((email) => email.endsWith("@camara.gov.br"), {
      message: "E-mail deve ser do domínio @camara.gov.br",
    }),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Senha deve conter pelo menos uma letra maiúscula",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Senha deve conter pelo menos uma letra minúscula",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Senha deve conter pelo menos um número",
    }),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  department: z
    .string()
    .min(1, "Departamento é obrigatório")
    .max(100, "Departamento deve ter no máximo 100 caracteres"),
  role: z
    .string()
    .min(1, "Cargo é obrigatório")
    .max(100, "Cargo deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de telefone inválido. Use: (XX) XXXXX-XXXX"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema para redefinição de senha
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .refine((email) => email.endsWith("@prefeitura.gov.br"), {
      message: "E-mail deve ser do domínio @prefeitura.gov.br",
    }),
});

// Schema para nova senha
export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Senha deve conter pelo menos uma letra maiúscula",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Senha deve conter pelo menos uma letra minúscula",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Senha deve conter pelo menos um número",
    }),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Schema para perfil do usuário
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .refine((email) => email.endsWith("@prefeitura.gov.br"), {
      message: "E-mail deve ser do domínio @prefeitura.gov.br",
    }),
  department: z
    .string()
    .min(1, "Departamento é obrigatório")
    .max(100, "Departamento deve ter no máximo 100 caracteres"),
  role: z
    .string()
    .min(1, "Cargo é obrigatório")
    .max(100, "Cargo deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de telefone inválido. Use: (XX) XXXXX-XXXX"),
  bio: z
    .string()
    .max(500, "Biografia deve ter no máximo 500 caracteres")
    .optional(),
});

// Tipos TypeScript inferidos dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
