import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { registerUseCase } from '@/use-cases/register'

export async function register (request: FastifyRequest, reply: FastifyReply) {
  /// Definindo o esquema para validar o corpo da requisição
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // Validando o corpo da requisição com base no esquema definido
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ // Chama a função registerUseCase passando os dados validados
      name,
      email,
      password
    })
  } catch(err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
