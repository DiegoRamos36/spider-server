import { FastifyPluginCallback } from 'fastify';
import { getCuponsByUserId, newCoupon } from '../controllers/couponController';

// codigo: string;
// quantidade: number;
// dataExpedicao: Date;
// userId: number;

export const couponRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-cupom', {
    schema: {
      tags: ['Cupom'],
      body: {
        type: 'object',
        required: ['codigo', 'quantidade', 'dataExpedicao', 'userId'],
        properties: {
          codigo: { type: 'string' },
          quantidade: { type: 'number' },
          dataExpedicao: { type: 'string', format: 'date-time' },
          userId: { type: 'number' },
        },
      },
    },
    handler: newCoupon,
  });
  app.post('/obter-cupom', {
    schema: {
      tags: ['Cupom'],
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
    },
    handler: getCuponsByUserId,
  });
  done();
};
