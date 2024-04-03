import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  /// Definindo o esquema para validar o corpo da requisição
  const authenticateBodySchema = z.object({
    email: z.string().email(), // O campo 'email' deve ser uma string válida de e-mail
    password: z.string().min(6), // O campo 'password' deve ser uma string com no mínimo 6 caracteres
  })

  // Validando o corpo da requisição com base no esquema definido
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository() // Instanciação de um repositório de usuários utilizando Prisma
    const authenticateUseCase = new AuthenticateUseCase(usersRepository) // Instanciação de um caso de uso de autenticação passando o repositório de usuários

    await authenticateUseCase.execute({ 
      email,
      password
    }) // Execução do caso de uso de autenticação com os dados fornecidos
  } catch(err) {
    // Erro conhecido
    if(err instanceof InvalidCredentialsError) { // Se o erro for relacionado a credenciais inválidas
      return reply.status(400).send({message: err.message}) // Retorna uma resposta com status 400 e uma mensagem de erro
    }
    throw err // Lança o erro para tratamento posterior
  }
  return reply.status(200).send() // Retorna uma resposta com status 200 indicando sucesso na autenticação
}
