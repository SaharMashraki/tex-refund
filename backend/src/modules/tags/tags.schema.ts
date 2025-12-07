import { z } from 'zod';

export const TagSchema = z.object({
  id: z.number(),
  key: z.string(),
  labelEn: z.string(),
  labelHe: z.string(),
  category: z.string(),
  isSystem: z.boolean(),
});

export const GetTagsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(TagSchema),
});

export type Tag = z.infer<typeof TagSchema>;
