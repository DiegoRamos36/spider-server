import { FastifyPluginCallback } from 'fastify';
import { getCuponsByUserId, newCoupon } from '../controllers/couponController';

export const couponRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-cupom', newCoupon);
  app.post('/obter-cupom', getCuponsByUserId);
  done();
};
