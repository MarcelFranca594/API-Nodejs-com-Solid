import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { UserAlreadyExistsError } from '@/use-cases/erros/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

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
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ // Chama a função registerUseCase passando os dados validados
      name,
      email,
      password
    })
  } catch(err) {
    // Erro conhecido
    if(err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({message: err.message})
    }
    throw err
  }
  return reply.status(201).send()
}
