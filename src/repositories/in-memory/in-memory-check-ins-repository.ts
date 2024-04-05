import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [] 

  async findByUserIdOnDate(userId: string, data: Date) {
    const checkInOnSameDate = this.items.find(
      checkIn => checkIn.user_id === userId,
    )

    if(!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  // Método assíncrono para criar um novo usuário
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null, // Corrigido para validated_at
      created_at: new Date(),
    };
    this.items.push(checkIn)
    return  checkIn
  } 
}
