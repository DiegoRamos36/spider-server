import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { hash, compare } from 'bcrypt';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';

const app = fastify();

const prisma = new PrismaClient({
  log: ['query'],
});

app.register(jwt, { secret: 'supersecret' });
app.register(cors, {
  origin: '*', // Permitir todas as origens (você pode especificar as origens permitidas)
});

app.decorate('auth', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

type RouteParams = {
  id: string;
};
type ItemBody = {
  nome: string;
  desc: string;
  imgSrc: string;
  imgAlt: string;
  preco: number;
  quantidade: number;
  slug: string;
  postData: string;
};

// AREA DO USUÁRIO

const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(9),
  password: z.string().min(8),
  email: z.string().email(),
  NdePedidos: z.number().int().nonnegative().default(0),
  pedidos: z.string().default(''),
  cargo: z.string().default('cliente'),
  carteira: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.number().int().optional(),
  complemento: z.string().optional(),
  pontoDeReferencia: z.string().optional(),
  cupons: z
    .array(
      z.object({
        id: z.number().int().positive(),
        codigo: z.string(),
        quantidade: z.number().int().positive(),
        dataExpedicao: z.date(),
        userId: z.number().int().positive(),
      }),
    )
    .optional(),
});

//Criar novo usuário

app.post('/register', async (req, res) => {
  const createUserSchema = userSchema.pick({
    username: true,
    password: true,
    email: true,
  });

  try {
    const data = createUserSchema.parse(req.body);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: await hash(data.password, 10),
        email: data.email,
      },
    });

    return res.status(201).send({ userId: user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ errors: error.errors });
    } else {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
});

// Autenticar usuário

app.post('/login', async (req, res) => {
  const autenticateUserSchema = userSchema.pick({
    email: true,
    password: true,
  });

  const validacao = autenticateUserSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).send({ error: validacao.error.errors });
  }

  const { email, password } = validacao.data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const validarSenha = await compare(password, user.password);
  if (!validarSenha) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const token = app.jwt.sign({ id: user.id, email: user.email });
  return res.send(token);
});

// FIM DA AREA DO USUÁRIO

// AREA DE ITENS (QUALQUER TIPO DE ITEM)

const itemSchema = z.object({
  nome: z.string(),
  desc: z.string().nullable(),
  preco: z.number().positive(),
  imgSrc: z.string(),
  imgAlt: z.string(),
  quantidade: z.number().positive().nullable(),
  slug: z.string(),
});

// criar item

app.post('/cardapio', async (req, res) => {
  const data = itemSchema.parse(req.body);

  const item = await prisma.item.create({
    data: {
      nome: data.nome,
      desc: data.desc,
      preco: data.preco,
      quantidade: data.quantidade,
      slug: data.slug,
      imgSrc: data.imgSrc,
      imgAlt: data.imgAlt,
    },
  });
  return res.status(201).send({ itemId: item.id });
});

// ver todos os itens
app.get('/cardapio', async (req, res) => {
  const menuItems = await prisma.item.findMany();

  return menuItems;
});

// ver item por nome

app.get(
  '/cardapio/:id',
  async (req: FastifyRequest<{ Params: RouteParams }>, res: FastifyReply) => {
    const { id } = req.params;

    const menuItems = await prisma.item.findFirst({
      where: {
        slug: id,
      },
    });

    if (!menuItems) {
      return res.status(404).send('Item não encontrado');
    }

    return res.send(menuItems);
  },
);

// excluir item por id
app.delete(
  '/cardapio/:id',
  async (req: FastifyRequest<{ Params: RouteParams }>, res: FastifyReply) => {
    const { id } = req.params;
    const deletarItem = await prisma.item.delete({
      where: {
        id: parseInt(id),
      },
    });
  },
);

// editar item

app.put(
  '/cardapio/:id',
  async (
    req: FastifyRequest<{ Params: RouteParams; Body: ItemBody }>,
    res: FastifyReply,
  ) => {
    const { id } = req.params;
    const { nome, desc, preco, quantidade, slug } = req.body;
    const itemAtualizado: Partial<ItemBody> = {};
    if (nome !== undefined) itemAtualizado.nome = nome;
    if (desc !== undefined) itemAtualizado.desc = desc;
    if (preco !== undefined) itemAtualizado.preco = preco;
    if (quantidade !== undefined) itemAtualizado.quantidade = quantidade;
    if (slug !== undefined) itemAtualizado.slug = slug;

    const atualizarItem = await prisma.item.update({
      where: {
        id: parseInt(id),
      },
      data: itemAtualizado,
    });

    return res.send(atualizarItem);
  },
);

// FIM AREA DE ITENS

//AREA DE PEDIDOS

// app.post('/novo-pedido', { preHandler: app.auth }, async (request: any, reply: any) => {
//   const userId = request.user?.id;

//   if (!userId) return reply.status(401).send('Não autorizado');

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) return reply.status(404).send('Usuário não encontrado');

//     const { pedidos } = request.body;

//     if (typeof pedidos !== 'string') {
//       return reply.status(400).send('Campo "pedidos" deve ser uma string');
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: {
//         NdePedidos: user.NdePedidos + 1,
//         pedidos: pedidos,
//       },
//     });

//     reply.send('Pedido adicionado com sucesso');
//   } catch (err) {
//     console.error(err);
//     reply.status(500).send('Erro ao atualizar o pedido');
//   }
// });

// //PEGAR PEDIDOS

// app.post('/pedidos', { preHandler: app.auth }, async (request: any, reply: any) => {
//   const userId = request.user?.id;

//   if (!userId) return reply.status(401).send('Não autorizado');

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId }, select: { pedidos: true }
//     });

//     if (!user) return reply.status(404).send('Usuário não encontrado');

//     const pedidos = user.pedidos;

//     reply.send({pedidos});
//   } catch (err) {
//     console.error(err);
//     reply.status(500).send('Erro ao buscar os pedidos do usuário');
//   }
// });

//AREA DE CUPOM

type NovoCupomRequest = {
  codigo: string;
  quantidade: number;
  dataExpedicao: Date;
  userId: number;
};

const cupomSchema = z.object({
  codigo: z.string(),
  quantidade: z.number().int().positive(),
  dataExpedicao: z.date(),
  userId: z.number().int().positive(),
  user: userSchema.optional(),
});

app.post(
  '/novo-cupom',
  async (
    req: FastifyRequest<{ Body: NovoCupomRequest }>,
    res: FastifyReply,
  ) => {
    try {
      const body = req.body;

      if (typeof body.dataExpedicao === 'string') {
        body.dataExpedicao = new Date(body.dataExpedicao);
      }

      const data = cupomSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!userExists) {
        return res.status(400).send({ message: 'Usuário não encontrado!' });
      }

      const novoCupom = await prisma.cupom.create({
        data: {
          codigo: data.codigo,
          quantidade: data.quantidade,
          dataExpedicao: data.dataExpedicao,
          userId: data.userId,
        },
      });

      return res.status(201).send(novoCupom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).send({ errors: error.errors });
      } else {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  },
);

app.get(
  '/cupons/:userId',
  async (
    req: FastifyRequest<{ Params: { userId: string } }>,
    res: FastifyReply,
  ) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res
        .status(400)
        .send({ message: 'Id do usuário deve ser um número valido' });
    }

    try {
      const cupons = await prisma.cupom.findMany({
        where: { userId: userId },
      });

      if (cupons.length === 0) {
        return res
          .status(404)
          .send({ message: 'Nenhum cupom encontrado para este usuário' });
      }

      return res.send(cupons);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).send({ errors: error.errors });
      } else {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    }
  },
);

app.listen({ port: 8081 }).then(() => {
  console.log('Servidor rodando na porta 8081');
});
