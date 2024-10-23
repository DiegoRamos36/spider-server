import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  authEmployee,
  deleteEmployeeById,
  getEmployeeByName,
  getEmployees,
  newEmployee,
} from '../controllers/employeesController';

export const EmployeeRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/registrar-funcionario', newEmployee);
  app.post('/autenticar-funcionario', authEmployee);
  app.get('/obter-todos-funcionarios', getEmployees);
  app.post('/obter-funcionario-nome', getEmployeeByName);
  app.post('/deletar-funcionario', deleteEmployeeById);

  done();
};
