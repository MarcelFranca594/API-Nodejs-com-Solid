import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

// Interface que define a estrutura esperada para o objeto de requisição de registro de usuário
interface RegisterUseCaseRequest {
  // Criar um usuário
  name: string;
  email: string;
  password: string

}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  // Consulta no banco de dados para verificar se já existe um usuário com o mesmo e-mail
  const userWithSameEmail = await prisma.user.findUnique({// Consulta no banco de dados para encontrar um usuário com o mesmo e-mail
    where: {
      email,
    },
  })

  if(userWithSameEmail){
    throw new Error('E-mail already exists')
  }

  // Se não existir um usuário com o mesmo e-mail, cria um novo usuário no banco de dados
  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}