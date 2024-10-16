import { FastifyRequest, FastifyReply } from 'fastify';
import { hash, compare } from 'bcrypt';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../models/userModel';

const prisma = new PrismaClient();

export const registerUser = async (req: FastifyRequest, res: FastifyReply) => {
  const createUserSchema = userSchema.pick({
    username: true,
    password: true,
    email: true,
  });

  try {
    const data = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: await hash(data.password, 10),
        email: data.email,
      },
    });

    return res.status(201).send({ userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error Prisma' });
    }
  }
};

export const autenticateUser = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const autenticateUserSchema = userSchema.pick({
    email: true,
    password: true,
  });

  const validacao = autenticateUserSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).send({ error: validacao.error.errors });
  }

  const { email, password } = validacao.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const validarSenha = await compare(password, user.password);

  if (!validarSenha) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const token = await res.jwtSign({
    id: user.id,
    email: user.email,
    name: user.username,
  });
  if (!token) return res.status(400).send('Erro na geração do token');

  return res.send(token);
};
