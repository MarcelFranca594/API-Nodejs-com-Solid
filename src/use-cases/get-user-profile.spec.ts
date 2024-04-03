import { expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-found-error'


let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository() // Criando uma instância do repositório de usuários em memória
    sut = new GetUserProfileUseCase(usersRepository) // sut => principal variável que está sendo testada
  })

  // Teste: Se um usuário consegue se autenticar na aplicação
  it('should be able to get user profile', async () => {
   // Criando um usuário de exemplo e armazenando-o no repositório
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      // Usando a função hash para criar uma senha criptografada
      password_hash: await hash('123456', 6),
    })
    
    // Executando o caso de uso de autenticação com as credenciais do usuário de exemplo
    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with worng id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})
