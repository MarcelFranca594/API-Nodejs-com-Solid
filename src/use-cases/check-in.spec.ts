import { expect, describe, it, beforeEach, afterEach ,vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'



let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository() // Criando uma instância do repositório de usuários em memória
    sut = new CheckInUseCase(checkInsRepository)   // Criando uma instância do caso de uso de registro, passando o repositório criado

    vi.useFakeTimers()
})
  afterEach(() => {
    vi.useRealTimers()
  })


  // Teste: deve ser capaz de registrar um usuário
  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))


    // Executando o caso de uso de registro com dados de usuário específicos
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
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
    })

    await expect(() => 
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
    }),
  ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
    })
  
    expect(checkIn.id).toEqual(expect.any(String))

  })
})
