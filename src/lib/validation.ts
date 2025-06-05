import { z } from 'zod';

export const vipPreregisterSchema = z.object({
  name: z
    .string()
    .min(1, 'Por favor, digite seu nome')
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(255, 'O nome não pode ter mais de 255 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'O nome deve conter apenas letras e espaços'),
  
  email: z
    .string()
    .min(1, 'Por favor, digite seu e-mail')
    .email('Por favor, digite um e-mail válido')
    .max(255, 'O e-mail não pode ter mais de 255 caracteres')
    .toLowerCase()
});

export type VipPreregisterForm = z.infer<typeof vipPreregisterSchema>;

export const validateVipPreregister = (data: unknown) => {
  return vipPreregisterSchema.safeParse(data);
}; 