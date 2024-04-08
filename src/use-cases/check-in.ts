import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface  CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase  {
  constructor( 
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
    const gym = await this.gymsRepository.findById(gymId)

    if(!gym){
      throw new ResourceNotFoundError()
    }

    // calculate distance between user and gym

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if(checkInOnSameDay) {
      throw new Error()
    }


   const checkIn = await this.checkInRepository.create({
    gym_id: gymId,
    user_id: userId,
   })
    return {
      checkIn,
    }
  }
}