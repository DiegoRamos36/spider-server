import z from 'zod';

export type UpdateAddresParams = {
  userId: number;
  enderecoId: number;
};

export type Adress = {
  id: number;
  nome: string;
  address: string;
  bairro: string;
  numero: string;
  reference: string;
  userId: string;
};

export const addressSchema = z.object({
  nome: z.string(),
  address: z.string(),
  bairro: z.string().nullable(),
  numero: z.string().nullable(),
  reference: z.string().nullable(),
  userId: z.number().positive(),
});
