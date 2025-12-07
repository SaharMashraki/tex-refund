import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { DocumentResponseSchema } from './documents.schema';
import { createDocument, getDocumentById, storageService } from './documents.service';

export async function documentsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/upload', {
    schema: {
      tags: ['Documents'],
      summary: 'Upload a document',
      security: [{ bearerAuth: [] }],
      response: {
        201: DocumentResponseSchema,
        400: z.object({ message: z.string() }),
      }
    }
  }, async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }
    
    // @ts-ignore
    const userId = request.user.id; 
    const doc = await createDocument(userId, data);
    
    return reply.code(201).send({ success: true, data: doc as any });
  });

  app.withTypeProvider<ZodTypeProvider>().get('/:id', {
    schema: {
      tags: ['Documents'],
      summary: 'Get document details',
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.coerce.number() }),
      response: {
        200: DocumentResponseSchema,
        404: z.object({ message: z.string() }),
      }
    }
  }, async (request, reply) => {
    // @ts-ignore
    const userId = request.user.id;
    const { id } = request.params as { id: number };
    const doc = await getDocumentById(id, userId);
    
    if (!doc) {
      return reply.code(404).send({ message: 'Document not found' });
    }
    
    return { success: true, data: doc as any };
  });
}
