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
    },
    handler: newAddress,
  });
  app.post('/get-address', {
    schema: {
      tags: ['Endereços'],
    },
    handler: getAddress,
  });
  app.post('/remove-address', {
    schema: {
      tags: ['Endereços'],
    },
    handler: removeAddress,
  });
  app.post('/get-default-address', {
    schema: {
      tags: ['Endereços'],
    },
    handler: getDefaultAddress,
  });
  app.post('/set-default-address', {
    schema: {
      tags: ['Endereços'],
    },
    handler: setDefaultAddress,
  });
  done();
};
