import { z } from 'zod';
import { TagSchema } from '../tags/tags.schema';

export const DocumentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  storagePath: z.string(),
  status: z.enum(['UPLOADED', 'PROCESSING', 'READY_FOR_PREVIEW', 'PAID']),
  createdAt: z.date(),
  tags: z.array(z.object({
    confidence: z.number(),
    tag: TagSchema
  })).optional(),
});

export const DocumentResponseSchema = z.object({
  success: z.boolean(),
  data: DocumentSchema,
});
