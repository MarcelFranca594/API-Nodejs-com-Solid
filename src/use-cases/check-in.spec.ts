import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { MaxDistanceError } from './erros/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository() // Criando uma instância do repositório de usuários em memória
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)   // Criando uma instância do caso de uso de registro, passando o repositório criado

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      Latitude: -15.7218296,
      longitude: -56.1374312,
    })
    

    vi.useFakeTimers()
})
  afterEach(() => {
    vi.useRealTimers()
  })

  // Teste: deve ser capaz de registrar um usuário
  it('should be able to check-in', async () => {

    // Executando o caso de uso de registro com dados de usuário específicos
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:  -15.7218296,
      userLongitude: -56.1374312,
    })

    console.log(checkIn.created_at)

    // Verificando se o ID do usuário é uma string
    expect(checkIn.id).toEqual(expect.any(String))
  })

  //1°Etapa - RED (Fazer bugar) - Green (Fazer Funcionar) - Refactor
  // Teste: deve ser capaz de registrar um usuário
  it('should be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:  -15.7218296,
      userLongitude: -56.1374312,
    })

    await expect(() => 
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude:  -15.7218296,
        userLongitude: -56.1374312,
    }),
  ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude:  -15.7218296,
      userLongitude: -56.1374312,
    })


    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude:  -15.7218296,
        userLongitude: -56.1374312,
    })
  
    expect(checkIn.id).toEqual(expect.any(String))

  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      Latitude: new Decimal(-15.6891362),
      longitude: new Decimal(-56.1300797),
    })
    
    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude:  -15.7218296,
      userLongitude: -56.1374312,
    }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
