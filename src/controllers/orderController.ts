import Stripe from 'stripe';
import dotenv from 'dotenv';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Produto, Pedido, PrismaClient } from '@prisma/client';

dotenv.config();
const stripekey = process.env.STRIPE_KEY || '';
const stripe = new Stripe(stripekey);
const prisma = new PrismaClient();
const endpointSecret = process.env.ENDPOINT_SECRET || '';

type Payment = {
  products: Produto[];
  coupon: string;
  userId: string;
};

export const createPayment = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { products, coupon, userId } = req.body as Payment;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send({ error: 'Produtos inválidos ou ausentes' });
    }

    if (!userId) return res.status(400).send({ error: 'userId inválido!' });

    const lineItems = products.map((product: Produto) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: product.name,
          images: [product.imgSrc],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: 1,
    }));

    const discounts = coupon ? [{ coupon }] : [];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      discounts,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      success_url: 'https://spider-burguer.vercel.app/sucesso',
      cancel_url: 'https://spider-burguer.vercel.app/falha',
      locale: 'pt-BR',
    });

    const order = await prisma.pedido.create({
      data: {
        sessionId: session.id,
        userId: Number(userId),
        amountTotal: session.amount_total !== null ? session.amount_total : 0,
        currency: session.currency === null ? '' : session.currency,
        produtos: {
          create: products.map((product) => ({
            quantity: 1,
            produto: {
              connect: { id: product.id },
            },
          })),
        },
        coupon: coupon || null,
      },
    });

    res.send({
      id: session.id,
      order,
    });
  } catch (error) {
    console.error('Erro ao criar a sessão de checkout:', error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

export const getUserOrders = async (req: FastifyRequest, res: FastifyReply) => {
  const { userId } = req.body as Partial<Pedido>;
  if (!userId) {
    return res.status(400).send({ error: 'userId é necessário' });
  }

  const pedidos = await prisma.pedido.findMany({
    where: {
      userId: userId,
    },
    include: {
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });

  return res.status(200).send(pedidos);
};

export const getAllOrders = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const prismaPedidos = await prisma.pedido.findMany();

    const pedidos = prismaPedidos.map((pedido) => ({
      amount_total: pedido.amountTotal,
      created_at: pedido.createdAt,
      id: pedido.id,
      sessionId: pedido.sessionId,
      payment_status: pedido.payment_status,
    }));

    return res.status(200).send(pedidos);
  } catch (e) {
    return res
      .status(404)
      .send({ error: e instanceof Error ? e.message : 'Erro Desconhecido' });
  }
};

export const setPaymentStatus = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const { id, status } = req.body as { id: number; status: string };

  try {
    const updatedOrder = await prisma.pedido.update({
      where: {
        id,
      },
      data: {
        payment_status: status,
      },
    });

    return res
      .status(200)
      .send({ status: updatedOrder.payment_status, id: updatedOrder.id });
  } catch (e) {
    return res
      .status(404)
      .send({ error: e instanceof Error ? e.message : 'Erro Desconhecido' });
  }
};

export const getOrders = async (req: FastifyRequest, res: FastifyReply) => {
  const { date } = req.body as { date: string };

  const pedidos = await prisma.pedido.findMany({
    where: {
      createdAt: date,
    },
    include: {
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });

  return res.status(200).send(pedidos);
};
