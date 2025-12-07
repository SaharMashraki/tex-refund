import { FastifyInstance } from 'fastify';
import { authRoutes } from './modules/auth/auth.routes';
import { tagsRoutes } from './modules/tags/tags.routes';
import { documentsRoutes } from './modules/documents/documents.routes';
import { paymentsRoutes } from './modules/payments/payments.routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(tagsRoutes, { prefix: '/tags' });
  app.register(documentsRoutes, { prefix: '/documents' });
  app.register(paymentsRoutes, { prefix: '/payments' });
}
