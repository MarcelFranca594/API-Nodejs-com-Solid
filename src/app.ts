import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

// Criando conexão com o banco de dados utilizando o Prisma
const prisma = new PrismaClient()

// Criando um novo usuário no banco de dados
prisma.user.create({
  data: {
    name: 'Marcel Igor',
    email: 'marcel@rocketseat.com.br'
  }
})
