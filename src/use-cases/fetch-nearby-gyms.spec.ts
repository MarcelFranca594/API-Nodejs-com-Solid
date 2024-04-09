import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository() 
    sut = new FetchNearbyGymsUseCase(gymsRepository)   
})

  it('should be able to fetch nearby gyms', async () => {
  await gymsRepository.create({
    title: 'Near Gym',
    description: null,
    phone: null,
    Latitude:  -15.7218296,
    longitude: -56.1374312,
  })

  await gymsRepository.create({
    title: 'Far Gym',
    description: null,
    phone: null,
    Latitude:  -15.5876791,
    longitude: -56.082856,
  })

    const { gyms } = await sut.execute({
      userLatitude:  -15.7218296,
      userLongitude: -56.1374312,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
