import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { getAllTags } from './tags.service';
import { GetTagsResponseSchema } from './tags.schema';

export async function tagsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        summary: 'Get all system tags',
        tags: ['Tags'],
        response: {
          200: GetTagsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const tags = await getAllTags();
      return { success: true, data: tags };
    }
  );
}
