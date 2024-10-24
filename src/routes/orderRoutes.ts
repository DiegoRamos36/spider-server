import { FastifyPluginCallback } from 'fastify';
import {
  createPayment,
  getAllOrders,
  getOrders,
  getUserOrders,
  setPaymentStatus,
} from '../controllers/orderController';

export const orderRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/create-checkout-session', createPayment);
  app.post('/pedidos', getUserOrders);
  app.post('/delivery', getOrders);

  app.get('/pedidos', getAllOrders);
  app.post('/payment-status', setPaymentStatus);

  done();
};
