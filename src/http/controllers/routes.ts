import { FastifyInstance } from "fastify";
import { register } from "./register";

// Criando uma rota para registrar usuários
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}

