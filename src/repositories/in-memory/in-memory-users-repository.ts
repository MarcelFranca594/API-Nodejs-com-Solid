import { Prisma, User } from "@prisma/client";
import { usersRepository } from "../users.repository";

// Declaração da classe InMemoryUsersRepository que implementa a interface usersRepository
export class InMemoryUsersRepository implements usersRepository {
  // Declaração de um array chamado items que armazenará os usuários
  public items: User[] = [] 

   // Método assíncrono para buscar um usuário pelo e-mail
   async findById(id: string){
    // Usa o método find para buscar um usuário com o e-mail fornecido no array de items
    const user = this.items.find(item => item.id === id)

    // Se o usuário não for encontrado, retorna null
    if(!user){
      return null
    }

    // Retorna o usuário encontrado
    return user
  }

  // Método assíncrono para buscar um usuário pelo e-mail
  async findByEmail(email: string){
    // Usa o método find para buscar um usuário com o e-mail fornecido no array de items
    const user = this.items.find(item => item.email === email)

    // Se o usuário não for encontrado, retorna null
    if(!user){
      return null
    }

    // Retorna o usuário encontrado
    return user
  }

  // Método assíncrono para criar um novo usuário
  async create(data: Prisma.UserCreateInput){
    // Cria um novo usuário com os dados fornecidos
    const user = {
      id: 'user-1', // ID temporário apenas para exemplo
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(), // Define a data de criação como a data atual
    }

    // Adiciona o novo usuário ao array de items
    this.items.push(user)

    // Retorna o usuário criado
    return user 
  }
}
