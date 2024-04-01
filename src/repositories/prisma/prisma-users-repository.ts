import { prisma } from "@/lib/prisma"
import { Prisma } from '@prisma/client'
import { usersRepository } from "../users.repository"

export class PrismaUsersRepository implements usersRepository {
  async create(data: Prisma.UserCreateInput) {
       // Se não existir um usuário com o mesmo e-mail, cria um novo usuário no banco de dados
  const user = await prisma.user.create({
    data,
  })
  return user
  }
}
