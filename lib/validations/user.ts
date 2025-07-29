import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
  role: z.enum(['admin', 'editor', 'viewer']),
  department: z.string().min(1, 'Departamento é obrigatório'),
});

export type CreateUserData = z.infer<typeof createUserSchema>;