import { prisma } from "@/lib/prisma"
import { Prisma } from '@prisma/client'
import { usersRepository } from "../users.repository"

export class PrismaUsersRepository implements usersRepository {
  async findByEmail(email: string) {
     // Consulta no banco de dados para verificar se já existe um usuário com o mesmo e-mail
     const user = await prisma.user.findUnique({// Consulta no banco de dados para encontrar um usuário com o mesmo e-mail
      where: {
        email,
      },
    })
    return user 
  }

  async create(data: Prisma.UserCreateInput) {
  // Se não existir um usuário com o mesmo e-mail, cria um novo usuário no banco de dados
  const user = await prisma.user.create({
    data,
  })
  return user
  }
}
