import { FastifyRequest, FastifyReply} from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function register (request: FastifyRequest, reply: FastifyReply) {
  /// Definindo o esquema para validar o corpo da requisição
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // Validando o corpo da requisição com base no esquema definido
  const { name, email, password } = registerBodySchema.parse(request.body)

  const password_hash = await hash(password, 6)

  // Validar se tem um usuário com o mesmo e-mail
  const userWithSameEmail = await prisma.user.findUnique({// Consulta no banco de dados para encontrar um usuário com o mesmo e-mail
    where: {
      email,
    },
  })

  if(userWithSameEmail){
    return reply.status(409).send() // Retorna um código de status HTTP 409 (Conflito) indicando que o recurso já existe
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return reply.status(201).send()
}
