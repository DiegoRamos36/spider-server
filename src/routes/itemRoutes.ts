import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  deleteItemById,
  editItemById,
  getAllItems,
  getItemByName,
  newItem,
} from '../controllers/itemController';

export const ItemRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-item', {
    schema: {
      tags: ['Item'],
      summary: 'Criar novo item.',
      body: {
        type: 'object',
        required: ['name', 'price', 'imgSrc', 'desc', 'imgAlt'],
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          desc: { type: 'string' },
          imgSrc: { type: 'string' },
          imgAlt: { type: 'string' },
        },
      },
    },
    handler: newItem,
  });
  app.get('/obter-item', {
    schema: {
      tags: ['Item'],
      summary: 'Obter todos os itens.',
    },
    handler: getAllItems,
  });
  app.post('/obter-item-name', {
    schema: {
      tags: ['Item'],
      summary: 'Obter item pelo nome.',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
    },
    handler: getItemByName,
  });

  app.delete('/delete-item', {
    schema: {
      tags: ['Item'],
      summary: 'Deletar item por ID',
      body: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: deleteItemById,
  });
  app.put('/edit-item', {
    schema: {
      tags: ['Item'],
      summary: 'Editar item por ID.',
      body: {
        type: 'object',
        required: ['name', 'price', 'desc', 'id'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          desc: { type: 'string' },
        },
      },
    },
    handler: editItemById,
  });

  done();
};
