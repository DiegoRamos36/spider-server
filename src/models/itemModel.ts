import z from 'zod';

export const itemSchema = z.object({
  name: z.string(),
  desc: z.string().nullable(),
  price: z.number().positive(),
  imgSrc: z.string(),
  imgAlt: z.string(),
});
