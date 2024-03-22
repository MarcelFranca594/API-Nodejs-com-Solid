import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

// Criando conexão com o banco de dados utilizando o Prisma
// O parâmetro 'log' é utilizado para configurar o nível de logging do Prisma
export const prisma = new PrismaClient({
  // Se o ambiente for de desenvolvimento ('dev'), configura o logging para exibir todas as queries executadas
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
