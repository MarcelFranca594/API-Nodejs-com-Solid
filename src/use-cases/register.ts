import { usersRepository } from "@/repositories/users.repository";
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";
import { User } from "@prisma/client";


// Interface que define a estrutura esperada para o objeto de requisição de registro de usuário
interface RegisterUseCaseRequest {
  // Criar um usuário
  name: string;
  email: string;
  password: string

}

// SOLID
// D - Dependency Inversion Principle

interface RegisterUseCaseResponse {
  user: User
} 

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository){}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if(userWithSameEmail){
      throw new UserAlreadyExistsError()
    }
  
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    } 
  }
}
