import { expect, describe, it, beforeEach} from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'


let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository() // Criando uma instância do repositório de usuários em memória
    sut = new CheckInUseCase(checkInsRepository)   // Criando uma instância do caso de uso de registro, passando o repositório criado
  })

  // Teste: deve ser capaz de registrar um usuário
  it('should be able to check-in', async () => {
    // Executando o caso de uso de registro com dados de usuário específicos
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    // Verificando se o ID do usuário é uma string
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
