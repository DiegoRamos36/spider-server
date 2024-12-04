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
      body: {
        type: 'object',
        required: ['date'],
        properties: {
          userId: { type: 'string', format: 'date-time' },
        },
      },
    },
    handler: getOrders,
  });

  app.get('/pedidos', {
    schema: {
      tags: ['Pedidos'],
    },
    handler: getAllOrders,
  });
  app.post('/payment-status', {
    schema: {
      tags: ['Pedidos'],
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
