import fastify from 'fastify';

import fastifyCors from '@fastify/cors';
import { authCors } from './utilities/authCors';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { orderRoutes } from './routes/orderRoutes';
import { addressRoutes } from './routes/addressRoutes';
import { EmployeeRoutes } from './routes/employeeRoutes';
import { authRoutes } from './routes/authRoutes';
import { couponRoutes } from './routes/couponRoutes';
import { ItemRoutes } from './routes/itemRoutes';

dotenv.config();

const app = fastify();

app.register(swagger, {
  openapi: {
    info: {
      title: 'Spider API',
      description:
        'Esta API fornece um conjunto de endpoints para gerenciar um e-commerce. Ela permite a manipulação de todo o ecossistema do Spider. Além disso, oferece suporte para integração com sistemas de pagamento e relatórios detalhados.',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Pedidos',
      },
      {
        name: 'Usuários',
      },
      {
        name: 'Cupom',
      },
      {
        name: 'Item',
      },
      {
        name: 'Endereços',
      },
      {
        name: 'Funcionários',
      },
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    displayOperationId: false,
    docExpansion: 'none',
    displayRequestDuration: true,
  },
});
app.register(fastifyJwt, {
  secret: process.env.JWT_KEY || '',
});

app.register(authRoutes);
app.register(couponRoutes);
app.register(ItemRoutes);
app.register(orderRoutes);
app.register(EmployeeRoutes);
app.register(addressRoutes);
app.register(fastifyCors, authCors);

app
  .listen({
    port: Number(process.env.PORT) || 4000,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 4000}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
