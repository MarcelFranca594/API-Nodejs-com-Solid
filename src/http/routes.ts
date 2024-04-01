import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";

// Criando uma rota para registrar usuários
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}

