import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  deleteItemById,
  editItemById,
  getAllItems,
  getItemByName,
  newItem,
} from '../controllers/itemController';

// name: data.name,
// desc: data.desc || undefined,
// price: data.price,
// imgSrc: data.imgSrc,
// imgAlt: data.imgAlt,

export const ItemRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-item', {
    schema: {
      tags: ['Item'],
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
    },
    handler: getAllItems,
  });
  app.post('/obter-item-name', {
    schema: {
      tags: ['Item'],
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

  app.post('/delete-item', {
    schema: {
      tags: ['Item'],
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
  app.post('/edit-item', {
    schema: {
      tags: ['Item'],
      body: {
        type: 'object',
        required: ['name', 'price', 'desc'],
        properties: {
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
