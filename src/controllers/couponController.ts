import { FastifyReply, FastifyRequest } from 'fastify';
import { cupomSchema, RequestBody } from '../models/couponModel';
import { PrismaClient } from '@prisma/client';
import z from 'zod';

const prisma = new PrismaClient();

type NovoCupomRequest = {
  codigo: string;
  quantidade: number;
  dataExpedicao: Date;
  userId: number;
};

export const newCoupon = async (
  req: FastifyRequest<{ Body: NovoCupomRequest }>,
  res: FastifyReply,
) => {
  try {
    const body = req.body;

    if (typeof body.dataExpedicao === 'string') {
      body.dataExpedicao = new Date(body.dataExpedicao);
    }

    const data = cupomSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      return res.status(400).send({ message: 'Usuário não encontrado!' });
    }

    const novoCupom = await prisma.cupom.create({
      data: {
        codigo: data.codigo,
        quantidade: data.quantidade,
        dataExpedicao: data.dataExpedicao,
        userId: data.userId,
      },
    });

    return res.status(201).send(novoCupom);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
};

export const getCuponsByUserId = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  res: FastifyReply,
) => {
  const { userId } = req.body as RequestBody;

  try {
    const cupons = await prisma.cupom.findMany({
      where: { userId: userId },
    });

    if (cupons.length === 0) {
      return res
        .status(404)
        .send({ message: 'Nenhum cupom encontrado para este usuário' });
    }

    return res.send(cupons);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
};
