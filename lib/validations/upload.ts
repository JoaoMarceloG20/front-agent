import { z } from 'zod';

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Arquivo muito grande (máx 10MB)')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'Tipo de arquivo não suportado'
    ),
  title: z.string().min(1, 'Título é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
});