import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";


// Interface que define a estrutura esperada para o objeto de requisição de registro de usuário
interface CreateGymUseCaseRequest {
  // Criando uma academia
  title: string
  description: string | null
  phone: string | null
  Latitude: number
  longitude: number
}

// SOLID
// D - Dependency Inversion Principle

interface CreateGymUseCaseResponse {
  gym: Gym
} 

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository){}

  async execute({
   title,
   description,
   phone,
   Latitude,
   longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      Latitude,
      longitude,
    })

    return {
      gym,
    } 
  }
}
