import { Gym, Prisma } from "@prisma/client";
import { findManyNearbyParams, GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate";


export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [] 

   
   async findById(id: string){
    
    const gym = this.items.find(item => item.id === id)

    
    if(!gym){
      return null
    }
    
    return gym
  }

  async findManyNearby(params: findManyNearbyParams){
   return this.items.filter(item => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude},
      { latitude: item.Latitude.toNumber(), longitude: item.longitude.toNumber()}
    )

    console.log(distance)

    return distance < 10
   })
  }

  async searchMany(query: string, page: number){
    return this.items.filter(item => item.title.includes(query))
    .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput){
    const gym = {
      id: data.id ?? randomUUID(), 
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      Latitude: new Prisma.Decimal(data.Latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(), // Define a data de criação como a data atual
    }

    this.items.push(gym)

    return gym 
  }
}
