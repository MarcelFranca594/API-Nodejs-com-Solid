import { prisma } from "@/lib/prisma"
import { usersRepository } from "@/repositories/users.repository";
import { hash } from "bcryptjs"


// Interface que define a estrutura esperada para o objeto de requisição de registro de usuário
interface RegisterUseCaseRequest {
  // Criar um usuário
  name: string;
  email: string;
  password: string

}

// SOLID
// D - Dependency Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository){}

  async execute({
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
  
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
