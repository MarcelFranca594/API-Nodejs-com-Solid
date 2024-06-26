import { expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'


let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository() // Criando uma instância do repositório de usuários em memória
    sut = new AuthenticateUseCase(usersRepository) // sut => principal variável que está sendo testada
  })

  // Teste: Se um usuário consegue se autenticar na aplicação
  it('should be able to authenticate', async () => {
   // Criando um usuário de exemplo e armazenando-o no repositório
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      // Usando a função hash para criar uma senha criptografada
      password_hash: await hash('123456', 6),
    })
    
    // Executando o caso de uso de autenticação com as credenciais do usuário de exemplo
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    // Verificando se o ID do usuário retornado existe e é uma string
    expect(user.id).toEqual(expect.any(String))
  })

  // Teste: Não deve ser possível autenticar com e-mail errado
  it('should not be able to authenticate with wrong email', async () => {
  // Espera-se que a execução do caso de uso com um email e senha inválidos gere um erro de credenciais inválidas
    expect(() => sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvalidCredentialsError) // Espera-se que o erro seja do tipo InvalidCredentialsError

  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      // Usando a função hash para criar uma senha criptografada
      password_hash: await hash('123456', 6),
    })
    
    // Espera-se que a execução do caso de uso com um email e senha inválidos gere um erro de credenciais inválidas
    expect(() => sut.execute({
      email: 'johndoe@example.com',
      password: '123123',
    })).rejects.toBeInstanceOf(InvalidCredentialsError) // Espera-se que o erro seja do tipo InvalidCredentialsError

  })

})
