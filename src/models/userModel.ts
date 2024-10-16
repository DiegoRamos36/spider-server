import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(9),
  password: z.string().min(8),
  email: z.string().email(),
  NdePedidos: z.number().int().nonnegative().default(0),
  pedidos: z.string().default(''),
  cargo: z.string().default('cliente'),
  carteira: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.number().int().optional(),
  complemento: z.string().optional(),
  pontoDeReferencia: z.string().optional(),
  cupons: z
    .array(
      z.object({
        id: z.number().int().positive(),
        codigo: z.string(),
        quantidade: z.number().int().positive(),
        dataExpedicao: z.date(),
        userId: z.number().int().positive(),
      }),
    )
    .optional(),
});
