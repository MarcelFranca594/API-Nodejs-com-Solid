import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from "./controllers/authenticate";

// Criando uma rota para registrar usuários
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register) // Criando um usuário
  app.post('/sessions', authenticate) // Criando uma sessão de login, autenticação
}

