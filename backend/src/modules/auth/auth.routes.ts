import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { LoginSchema, RegisterSchema, AuthResponseSchema } from './auth.schema';
import { loginUser, registerUser, getUserProfile } from './auth.service';
import { authenticate } from '../../middleware/auth';

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
        const user = await registerUser(request.body);
        const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });
        return reply.code(201).send({
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        });
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
          const user = await loginUser(request.body);
          const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });
          return {
            token,
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              role: user.role
            }
          };
        } catch (e) {
          return reply.code(401).send({ message: 'Invalid credentials' });
        }
      }
    )
    .get(
      '/profile',
      {
        onRequest: [authenticate],
        schema: {
          tags: ['Auth'],
          response: {
            200: z.object({
              id: z.number(),
              email: z.string(),
              fullName: z.string(),
              role: z.string().optional()
            })
          }
        }
      },
      async (request, reply) => {
        const { id } = request.user as { id: number };
        const user = await getUserProfile(id);
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        };
      }
    )
    .post(
      '/logout',
      {
        schema: {
          tags: ['Auth'],
          response: {
            200: z.object({ message: z.string() })
          }
        }
      },
      async (request, reply) => {
        return { message: 'Logged out successfully' };
      }
    );
}
