import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export const app = fastify()

// Criando uma rota para registrar usuários
app.post('/users', async (request, reply) => {
  /// Definindo o esquema para validar o corpo da requisição
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // Validando o corpo da requisição com base no esquema definido
  const { name, email, password } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password, // Salvando a senha como 'password_hash' no banco de dados
    },
  })

  return reply.status(201).send()
})
