import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import {
  authEmployee,
  deleteEmployeeById,
  getEmployeeByName,
  getEmployees,
  newEmployee,
} from '../controllers/employeesController';

// nome: z.string(),
// username: z.string(),
// password: z.string().min(6),
// cargo: z.string(),
// endereco: z.string(),

export const EmployeeRoutes: FastifyPluginCallback = (app, options, done) => {
  app.post('/registrar-funcionario', {
    schema: {
      tags: ['Funcionários'],
      body: {
        type: 'object',
        required: ['nome', 'username', 'password', 'cargo', 'endereco'],
        properties: {
          nome: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
          cargo: { type: 'string' },
          endereco: { type: 'string' },
        },
      },
    },
    handler: newEmployee,
  });
  app.post('/autenticar-funcionario', {
    schema: {
      tags: ['Funcionários'],
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
      },
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
      body: {
        type: 'object',
        required: ['nome'],
        properties: {
          nome: { type: 'string' },
        },
      },
    },
    handler: getEmployeeByName,
  });
  app.post('/deletar-funcionario', {
    schema: {
      tags: ['Funcionários'],
      body: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number' },
        },
      },
    },
    handler: deleteEmployeeById,
  });

  done();
};
