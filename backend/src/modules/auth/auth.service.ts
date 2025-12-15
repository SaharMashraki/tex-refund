import prisma from '../../config/db';
import { z } from 'zod';
import { LoginSchema, RegisterSchema } from './auth.schema';
import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function registerUser(input: z.infer<typeof RegisterSchema>) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: hashedPassword,
      fullName: input.name,
      role: 'USER', // Default role
    },
  });

  return user;
}

export async function loginUser(input: z.infer<typeof LoginSchema>) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}
