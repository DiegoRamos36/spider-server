import { FastifyReply, FastifyRequest } from 'fastify';
import { itemSchema } from '../models/itemModel';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemBody = {
  name: string;
  desc: string;
  imgSrc: string;
  imgAlt: string;
  price: number;
};

export const newItem = async (req: FastifyRequest, res: FastifyReply) => {
  const data = itemSchema.parse(req.body);

  const item = await prisma.produto.create({
    data: {
      name: data.name,
      desc: data.desc || undefined,
      price: data.price,
      imgSrc: data.imgSrc,
      imgAlt: data.imgAlt,
    },
  });
  return res.status(201).send({ itemId: item.id });
};

// ver todos os itens
export const getAllItems = async (req: FastifyRequest, res: FastifyReply) => {
  const menuItems = await prisma.produto.findMany();
  return menuItems;
};

// ver item por nome
export const getItemByName = async (req: FastifyRequest, res: FastifyReply) => {
  const { name } = req.body as { name: string };

  const menuItem = await prisma.produto.findFirst({
    where: {
      name: {
        contains: name,
      },
    },
  });

  return res.send(menuItem);
};

// excluir item por id
export const deleteById = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.body as { id: string };
  const deletarItem = await prisma.produto.delete({
    where: {
      id: parseInt(id),
    },
  });
};

// editar item
export const editById = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const { name, desc, price } = req.body as {
    name: string;
    desc: string;
    price: number;
  };
  const itemAtualizado: Partial<ItemBody> = {};
  if (name !== undefined) itemAtualizado.name = name;
  if (desc !== undefined) itemAtualizado.desc = desc;
  if (price !== undefined) itemAtualizado.price = price;

  const atualizarItem = await prisma.produto.update({
    where: {
      id: parseInt(id),
    },
    data: itemAtualizado,
  });

  return res.send(atualizarItem);
};
