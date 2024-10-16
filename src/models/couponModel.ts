import { z } from 'zod';
import { userSchema } from './userModel';

export type NovoCupomRequest = {
  codigo: string;
  quantidade: number;
  dataExpedicao: Date;
  userId: number;
};

export type RequestBody = {
  userId: number;
};

export const cupomSchema = z.object({
  codigo: z.string(),
  quantidade: z.number().int().positive(),
  dataExpedicao: z.date(),
  userId: z.number().int().positive(),
  user: userSchema.optional(),
});
