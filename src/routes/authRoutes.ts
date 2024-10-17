import { FastifyPluginCallback } from 'fastify';
import {
  registerUser,
  autenticateUser,
  autenticateUserFromGoogle,
} from '../controllers/authController';

export const authRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/register', registerUser);
  app.post('/login', autenticateUser);
  app.post('/google-login', autenticateUserFromGoogle);
  done();
};
