import { FastifyPluginCallback } from 'fastify';
import {
  getAddress,
  getDefaultAddress,
  newAddress,
  removeAddress,
  setDefaultAddress,
} from '../controllers/addressController';

export const addressRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/new-address', {
    schema: {
      tags: ['Endereços'],
      summary: 'Criação de endereços vinculados a usuários.',
      body: {
        type: 'object',
        required: [
          'nome',
          'address',
          'bairro',
          'numero',
          'reference',
          'userId',
        ],
        properties: {
          nome: { type: 'string' },
          address: { type: 'string' },
          bairro: { type: 'string' },
          numero: { type: 'string' },
          reference: { type: 'string' },
          userId: { type: 'string' },
        },
      },
    },
    handler: newAddress,
  });
  app.post('/get-address', {
    schema: {
      tags: ['Endereços'],
      summary: 'Receber todos os endereços de um usuário.',
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'number' },
        },
      },
    },
    handler: getAddress,
  });
  app.post('/remove-address', {
    schema: {
      tags: ['Endereços'],
      summary: 'Deletar endereço de determinado usuário.',
      body: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
    },
    handler: removeAddress,
  });
  app.post('/get-default-address', {
    schema: {
      tags: ['Endereços'],
      summary: 'Receber o endereço padrão de envio de um usuário.',
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'number' },
        },
      },
    },
    handler: getDefaultAddress,
  });
  app.post('/set-default-address', {
    schema: {
      tags: ['Endereços'],
      summary: 'Definir endereço padrão do usuário.',
      body: {
        type: 'object',
        required: ['userId', 'enderecoId'],
        properties: {
          userId: { type: 'number' },
          enderecoId: { type: 'number' },
        },
      },
    },
    handler: setDefaultAddress,
  });
  done();
};
