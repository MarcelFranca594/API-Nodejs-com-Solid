import { Gym } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";

// Declaração da classe InMemoryUsersRepository que implementa a interface usersRepository
export class InMemoryGymsRepository implements GymsRepository {
  // Declaração de um array chamado items que armazenará os usuários
  public items: Gym[] = [] 

   // Método assíncrono para buscar um usuário pelo e-mail
   async findById(id: string){
    // Usa o método find para buscar um usuário com o e-mail fornecido no array de items
    const gym = this.items.find(item => item.id === id)

    // Se o usuário não for encontrado, retorna null
    if(!gym){
      return null
    }

    // Retorna o usuário encontrado
    return gym
  }
}
