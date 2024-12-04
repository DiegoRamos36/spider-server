import { FastifyPluginCallback } from 'fastify';
import {
  registerUser,
  autenticateUser,
  autenticateUserFromGoogle,
} from '../controllers/authController';

export const authRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/register', {
    schema: {
      tags: ['Usuários'],
      summary: 'Registro de usuários.',
      body: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: registerUser,
  });
  app.post('/login', {
    schema: {
      tags: ['Usuários'],
      summary: 'Autenticação de usuários.',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
    handler: autenticateUser,
  });

  app.post('/google-login', {
    schema: {
      tags: ['Usuários'],
      summary: 'Autenticação de usuários com Google API',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
    handler: autenticateUserFromGoogle,
  });
  done();
};
