import { z } from 'zod';

export const CheckoutSchema = z.object({
  documentId: z.number(),
});

export const CheckoutResponseSchema = z.object({
  checkoutUrl: z.string(),
});

export const WebhookResponseSchema = z.object({
  received: z.boolean(),
});
