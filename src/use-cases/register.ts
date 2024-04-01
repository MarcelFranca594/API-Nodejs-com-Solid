import { usersRepository } from "@/repositories/users.repository";
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";


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

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if(userWithSameEmail){
      throw new UserAlreadyExistsError()
    }
  
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
