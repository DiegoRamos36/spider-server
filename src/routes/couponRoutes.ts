import { FastifyPluginCallback } from 'fastify';
import { getCuponsByUserId, newCoupon } from '../controllers/couponController';

export const couponRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-cupom', {
    schema: {
      tags: ['Cupom'],
    },
    handler: newCoupon,
  });
  app.post('/obter-cupom', {
    schema: {
      tags: ['Cupom'],
    },
    handler: getCuponsByUserId,
  });
  done();
};
