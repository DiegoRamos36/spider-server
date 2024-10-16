import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import {
  addressSchema,
  Adress,
  UpdateAddresParams,
} from '../models/addressModel';
import z from 'zod';

const prisma = new PrismaClient();

export const newAddress = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = addressSchema.parse(req.body);

    if (!data) {
      return res.status(400).send({ error: 'Preencha todos os campos!' });
    }

    const endereco = await prisma.enderecos.create({
      data: {
        nome: data.nome,
        address: data.address,
        bairro: data.bairro || '',
        numero: data.numero || '',
        reference: data.reference || '',
        userId: data.userId,
      },
    });

    return res.status(201).send({
      message: 'Endereço criado com sucesso!',
      endereco: {
        id: endereco.id,
        nome: endereco.nome,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.errors });
    }

    console.error('Erro ao criar endereço:', error);
    return res
      .status(500)
      .send({ error: 'Erro ao criar endereço. Tente novamente mais tarde.' });
  }
};

export const getAddress = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId } = req.body as Partial<Adress>;
  if (!userId)
    return res.status(400).send({ error: 'userId deve ser fornecido' });

  const enderecos = await prisma.enderecos.findMany({
    where: {
      userId: Number(userId),
    },
  });

  return res.status(200).send(enderecos);
};

export const getDefaultAddress = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const { userId } = req.body as Partial<Adress>;

  if (!userId) return res.status(400).send({ error: 'UserId não definido.' });

  const defaultAddress = await prisma.enderecos.findFirst({
    where: {
      userId: Number(userId),
      padrao: true,
    },
  });

  if (!defaultAddress)
    return res
      .status(404)
      .send({ error: 'Nenhum endereço padrão selecionado' });

  return res.status(200).send(defaultAddress);
};

export const setDefaultAddress = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const { userId, enderecoId } = req.body as UpdateAddresParams;

  if (!userId || !enderecoId)
    return res.status(400).send({ error: 'UserId ou EnderecoId inválido!' });

  await prisma.enderecos.updateMany({
    where: {
      userId: Number(userId),
      padrao: true,
    },
    data: {
      padrao: false,
    },
  });

  const setAddress = await prisma.enderecos.update({
    where: {
      id: enderecoId,
    },
    data: {
      padrao: true,
    },
  });

  return res.status(200).send(setAddress);
};

export const removeAddress = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.body as Partial<Adress>;

  if (!id) return res.send(400).send({ error: 'Id inválido!' });

  const removedAddress = await prisma.enderecos.delete({
    where: {
      id: id,
    },
  });

  return res.send(200).send({ removed: true, removedAddress });
};
