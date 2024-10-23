import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { employeesSchema } from '../models/employeesModel';
import { compare, hash } from 'bcrypt';

const prisma = new PrismaClient();

export const newEmployee = async (req: FastifyRequest, res: FastifyReply) => {
  const data = employeesSchema.parse(req.body);

  const funcionario = await prisma.funcionarios.create({
    data: {
      nome: data.nome,
      username: data.username,
      password: await hash(data.password, 10),
      endereco: data.endereco,
      cargo: data.cargo,
    },
  });
  return res.status(201).send({ employeeName: funcionario.nome });
};

export const authEmployee = async (req: FastifyRequest, res: FastifyReply) => {
  const authEmployeeSchema = employeesSchema.pick({
    username: true,
    password: true,
  });

  const validacao = authEmployeeSchema.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).send({ error: validacao.error.errors });
  }

  const { username, password } = validacao.data;

  const user = await prisma.funcionarios.findUnique({
    where: { username: username },
  });

  if (!user) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const validarSenha = await compare(password, user.password);

  if (!validarSenha) {
    return res.status(400).send({ error: 'Email ou senha inválido' });
  }

  const token = await res.jwtSign({
    id: user.id,
    name: user.nome,
    cargo: user.cargo,
  });
  if (!token) return res.status(400).send('Erro na geração do token');

  return res.send(token);
};

export const getEmployees = async (req: FastifyRequest, res: FastifyReply) => {
  const funcionarios = await prisma.funcionarios.findMany({
    select: {
      id: true,
      username: true,
      cargo: true,
      endereco: true,
      nome: true,
    },
  });
  return res.status(200).send(funcionarios);
};

export const getEmployeeByName = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const { nome } = req.body as { nome: string };

  const employee = await prisma.funcionarios.findFirst({
    where: {
      nome: {
        contains: nome,
      },
    },
    select: {
      id: true,
      cargo: true,
      endereco: true,
      nome: true,
    },
  });

  return res.send(employee);
};

export const deleteEmployeeById = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const { id } = req.body as { id: number };

  if (!id || id <= 0) return res.status(404).send('Insira um id válido!');

  try {
    const deleteEmployee = await prisma.funcionarios.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).send(deleteEmployee.nome + ' excluído com sucesso!');
  } catch (e) {
    return res
      .status(400)
      .send(e instanceof Error ? e.message : 'Erro Desconhecido');
  }
};
