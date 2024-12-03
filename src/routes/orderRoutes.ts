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
    },
    handler: createPayment,
  });
  app.post('/pedidos', {
    schema: {
      tags: ['Pedidos'],
    },
    handler: getUserOrders,
  });
  app.post('/delivery', {
    schema: {
      tags: ['Pedidos'],
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
    },
    handler: setPaymentStatus,
  });

  done();
};
