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
    },
    handler: getItemByName,
  });
  app.post('/delete-item', {
    schema: {
      tags: ['Item'],
    },
    handler: deleteItemById,
  });
  app.post('/edit-item', {
    schema: {
      tags: ['Endereços'],
    },
    handler: editItemById,
  });
  done();
};
