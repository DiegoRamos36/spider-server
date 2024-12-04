import { FastifyPluginCallback } from 'fastify';
import { getCuponsByUserId, newCoupon } from '../controllers/couponController';

export const couponRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-cupom', {
    schema: {
      tags: ['Cupom'],
      summary: 'Criação de cupom para promoções',
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
      summary: 'Receber todos os cupons de um usuário.',
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
