import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate";

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

  async execute({ userId, gymId, userLatitude, userLongitude}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
    const gym = await this.gymsRepository.findById(gymId)

    if(!gym){
      throw new ResourceNotFoundError()
    }

    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
     { latitude: userLatitude, longitude: userLongitude },
     { 
      latitude: gym.Latitude.toNumber(), 
      longitude: gym.longitude.toNumber(),
    } 
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1  //0.1 => 100 metros

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error()
    }

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