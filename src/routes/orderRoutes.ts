import { FastifyPluginCallback } from 'fastify';
import { createPayment, getOrders } from '../controllers/orderController';

export const orderRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/create-checkout-session', createPayment);
  app.post('/pedidos', getOrders);
  done();
};
