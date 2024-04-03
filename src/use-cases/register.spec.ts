import { expect, describe, it, beforeEach} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

// Descrevendo o conjunto de testes relacionados ao caso de uso de registro
describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository() // Criando uma instância do repositório de usuários em memória
    sut = new RegisterUseCase(usersRepository)   // Criando uma instância do caso de uso de registro, passando o repositório criado
  })

  // Teste: deve ser capaz de registrar um usuário
  it('should be able to register', async () => {
    // Executando o caso de uso de registro com dados de usuário específicos
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    // Verificando se o ID do usuário é uma string
    expect(user.id).toEqual(expect.any(String))
  })

  // Teste específico: verificar se a senha do usuário é corretamente hash ao se registrar
  it('should hash user password upon registration', async () => {
    // Executando o caso de uso de registro com dados de usuário específicos
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    // Comparando a senha fornecida com o hash armazenado no usuário registrado
    const isPasswordCorrectlyHashed = await compare(
      '123456', // Senha fornecida
      user.password_hash, // Hash da senha armazenada no usuário
    )

    // Verificando se a senha foi corretamente hashada
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  // Teste: não deve ser capaz de registrar com o mesmo email duas vezes
  it('should not be able to register with same email twice', async () => {
   // Definindo um email que será usado duas vezes
   const email = 'johndoe@example.com'

    // Registrando um usuário com o email definido acima
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })
    
    // Verificando se o registro com o mesmo email gera um erro de usuário já existente
    await expect(() => 
      sut.execute({
        name: 'John Doe',
        email, 
        password: '123456'
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
