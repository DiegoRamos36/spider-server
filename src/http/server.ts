
import fastify, {FastifyRequest, FastifyReply } from 'fastify';
import {hash, compare} from 'bcrypt'
import {z} from 'zod';
import { Item, PrismaClient } from '@prisma/client';
import jwt from '@fastify/jwt'

const app = fastify();

const prisma = new PrismaClient({
  log: ['query'],
})

app.register(jwt, {secret: 'supersecret'})



type RouteParams = {
  id: string
}
type ItemBody = {
  nome: string,
  desc: string;
  imgSrc: string;
  imgAlt: string;
  preco: number;
  quantidade: number;
  slug: string;
}

// AREA DO USUÁRIO

//Criar novo usuário

app.post('/register', async(req, res)=> {
const createUserSchema = z.object({
  username: z.string().min(9, {message: "Usuário muito curto"}),
  password: z.string().min(8, {message: 'Senha muito curta'}),
  email: z.string().email({message: "Digite um email válido"})
})

const data = createUserSchema.parse(req.body)

 const user = await prisma.user.create({
  data: {
    username: data.username,
    password: await hash(data.password, 10),
    email: data.email,

  }
})
  return res.status(201).send({userId: user.id})
})


// Autenticar usuário

app.post('/login', async(req,res)=> {
  const autenticateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const validacao = autenticateUserSchema.safeParse(req.body);

  if(!validacao.success){
    return res.status(400).send({error: validacao.error.errors })
  }

  const {email, password} = validacao.data;
  const user = await prisma.user.findUnique({
    where: {email} 
  })

  if(!user) {
    return res.status(400).send({error: "Email ou senha inválido"})
  }

  const validarSenha = await compare(password, user.password) ;
  if(!validarSenha) {
    return res.status(400).send({error: "Email ou senha inválido"})
  }

  const token = app.jwt.sign({id: user.id, email: user.email});
  return token

})

// FIM DA AREA DO USUÁRIO


// AREA DE ITENS (QUALQUER TIPO DE ITEM)

// criar item

app.post('/cardapio', async(req, res)=> {
  const createItemSchema = z.object({
    nome: z.string(),
    desc: z.string().nullable(),
    preco: z.number().positive(),
    imgSrc: z.string(),
    imgAlt: z.string(),
    quantidade: z.number().positive().nullable(), 
    slug: z.string()
  })

  const data = createItemSchema.parse(req.body);

  const item = await prisma.item.create({
    data: {
      nome: data.nome,
      desc: data.desc,
      preco: data.preco,
      quantidade: data.quantidade,
      slug: data.slug,
      imgSrc: data.imgSrc,
      imgAlt: data.imgAlt
    }
  })
  return res.status(201).send({itemId: item.id})
})



// ver todos os itens
app.get('/cardapio', async(req, res)=> {
  const menuItems = await prisma.item.findMany()

  return menuItems
})

// ver item por nome

app.get('/cardapio/:id', async(req: FastifyRequest<{ Params: RouteParams }>, res: FastifyReply)=> {
  const {id} = req.params;
  
  const menuItems = await prisma.item.findMany({
    where: {
      slug: id
    }
  })

  if (menuItems.length === 0) {
    return res.status(404).send("Item não encontrado");
  }


  return res.send(menuItems);
})


// excluir item por id
app.delete('/cardapio/:id', async(req: FastifyRequest<{ Params: RouteParams }>, res: FastifyReply)=> {
  const {id} = req.params;
  const deletarItem = await prisma.item.delete({
    where : {
      id: parseInt(id)
    }
  })
})

// editar item

  app.put('/cardapio/:id', async(req: FastifyRequest<{ Params: RouteParams, Body: ItemBody }>, res: FastifyReply)=> {
    const {id} = req.params;
    const {nome, desc, preco, quantidade, slug} = req.body;
    const itemAtualizado: Partial<ItemBody> = {};
    if(nome !== undefined) itemAtualizado.nome = nome;
    if(desc !== undefined) itemAtualizado.desc = desc;
    if(preco !== undefined) itemAtualizado.preco = preco;
    if(quantidade !== undefined) itemAtualizado.quantidade = quantidade;
    if(slug !== undefined) itemAtualizado.slug = slug;

    const atualizarItem = await prisma.item.update({
      where : {
        id: parseInt(id)
      } ,
      data : itemAtualizado
    })

    return res.send(atualizarItem)
  })

// FIM AREA DE ITENS


app.listen({port: 8081}).then(()=> {
  console.log('Servidor rodando na porta 8081');
})