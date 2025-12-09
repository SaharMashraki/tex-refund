import prisma from '../../config/db';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from './auth.schema';
import { FastifyInstance } from 'fastify';

// Using simple string hashing for demo purposes (replace with bcrypt/argon2 in production)
const hashPassword = (pwd: string) => pwd; 
const verifyPassword = (pwd: string, hash: string) => pwd === hash;

export async function registerUser(input: z.infer<typeof RegisterSchema>) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error('User already exists');
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: hashPassword(input.password),
      fullName: input.name,
    },
  });

  return user;
}

export async function loginUser(input: z.infer<typeof LoginSchema>) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error('Invalid credentials');
  }
  return user;
}
