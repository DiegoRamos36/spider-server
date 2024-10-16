import { FastifyPluginCallback } from 'fastify';
import {
  getAddress,
  getDefaultAddress,
  newAddress,
  removeAddress,
  setDefaultAddress,
} from '../controllers/addressController';

export const addressRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/new-address', newAddress);
  app.post('/get-address', getAddress);
  app.post('/remove-address', removeAddress);
  app.post('/get-default-address', getDefaultAddress);
  app.post('/set-default-address', setDefaultAddress);
  done();
};
