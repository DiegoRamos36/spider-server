import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  deleteItemById,
  editItemById,
  getAllItems,
  getItemByName,
  newItem,
} from '../controllers/itemController';

export const ItemRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/novo-item', newItem);
  app.get('/obter-item', getAllItems);
  app.post('/obter-item-name', getItemByName);
  app.post('/delete-item', deleteItemById);
  app.post('/edit-item', editItemById);
  done();
};
