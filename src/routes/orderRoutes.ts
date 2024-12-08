import { FastifyPluginCallback } from 'fastify';
import {
  createPayment,
  getAllOrders,
  getOrders,
  getUserOrders,
  setPaymentStatus,
} from '../controllers/orderController';

export const orderRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/create-checkout-session', {
    schema: {
      tags: ['Pedidos'],
      summary: 'Criar pagamentos',
      body: {
        type: 'object',
        required: ['products', 'coupon', 'userId'],
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                name: { type: 'string' },
                desc: { type: 'string' },
                price: { type: 'number' },
                imgSrc: { type: 'string' },
                imgAlt: { type: 'string' },
              },
            },
          },
          coupon: { type: 'string' },
          userId: { type: 'string' },
        },
      },
    },
    handler: createPayment,
  });
  app.post('/pedidos', {
    schema: {
      tags: ['Pedidos'],
      summary: 'Obter pedidos de determinado usuário.',
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'number' },
        },
      },
    },
    handler: getUserOrders,
  });
  app.post('/delivery', {
    schema: {
      tags: ['Pedidos'],
      summary: 'Obter pedidos do dia.',
      body: {
        type: 'object',
        required: ['date'],
        properties: {
          date: { type: 'string', format: 'date-time' },
        },
      },
    },
    handler: getOrders,
  });

  app.get('/pedidos', {
    schema: {
      tags: ['Pedidos'],
      summary: 'Obter todos os pedidos.',
    },
    handler: getAllOrders,
  });
  app.post('/payment-status', {
    schema: {
      tags: ['Pedidos'],
      description: 'Se foi aprovado ou não',
      summary: 'Obter o status de algum pagamento.',
      body: {
        type: 'object',
        required: ['id', 'status'],
        properties: {
          id: { type: 'number' },
          status: { type: 'string' },
        },
      },
    },
    handler: setPaymentStatus,
  });

  done();
};
