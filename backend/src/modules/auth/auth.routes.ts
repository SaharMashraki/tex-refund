import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { LoginSchema, RegisterSchema, AuthResponseSchema } from './auth.schema';
import { loginUser, registerUser } from './auth.service';

export async function authRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .post(
      '/register',
      {
        schema: {
          tags: ['Auth'],
          body: RegisterSchema,
          response: {
            201: AuthResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const user = await registerUser(request.body as any);
        const token = app.jwt.sign({ id: user.id, email: user.email });
        return reply.code(201).send({ token, user: { id: user.id, email: user.email, fullName: user.fullName } });
      }
    )
    .post(
      '/login',
      {
        schema: {
          tags: ['Auth'],
          body: LoginSchema,
          response: {
            200: AuthResponseSchema,
            401: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        try {
          const user = await loginUser(request.body as any);
          const token = app.jwt.sign({ id: user.id, email: user.email });
          return { token, user: { id: user.id, email: user.email, fullName: user.fullName } };
        } catch (e) {
          return reply.code(401).send({ message: 'Invalid credentials' });
        }
      }
    );
}
