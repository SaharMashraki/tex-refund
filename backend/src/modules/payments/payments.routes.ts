import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CheckoutSchema, CheckoutResponseSchema, WebhookResponseSchema } from './payments.schema';
import { createCheckoutSession, handleWebhook } from './payments.service';

export async function paymentsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .post('/checkout', {
      schema: {
        tags: ['Payments'],
        summary: 'Create Checkout Session',
        security: [{ bearerAuth: [] }],
        body: CheckoutSchema,
        response: {
          200: CheckoutResponseSchema
        }
      }
    }, async (request, reply) => {
      // @ts-ignore
      const userId = request.user.id;
      const { documentId } = request.body as { documentId: number };
      const session = await createCheckoutSession(userId, documentId);
      return { checkoutUrl: session.url };
    })
    .post('/webhook', {
      schema: {
        tags: ['Payments'],
        summary: 'Stripe Webhook',
        response: {
          200: WebhookResponseSchema
        }
      }
    }, async (request, reply) => {
      await handleWebhook(request.body);
      return { received: true };
    });
}
