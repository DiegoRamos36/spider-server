import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  authEmployee,
  deleteEmployeeById,
  getEmployeeByName,
  getEmployees,
  newEmployee,
} from '../controllers/employeesController';

export const EmployeeRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/registrar-funcionario', {
    schema: {
      tags: ['Funcionários'],
    },
    handler: newEmployee,
  });
  app.post('/autenticar-funcionario', {
    schema: {
      tags: ['Funcionários'],
    },
    handler: authEmployee,
  });
  app.get('/obter-todos-funcionarios', {
    schema: {
      tags: ['Funcionários'],
    },
    handler: getEmployees,
  });
  app.post('/obter-funcionario-nome', {
    schema: {
      tags: ['Funcionários'],
    },
    handler: getEmployeeByName,
  });
  app.post('/deletar-funcionario', {
    schema: {
      tags: ['Funcionários'],
    },
    handler: deleteEmployeeById,
  });

  done();
};
