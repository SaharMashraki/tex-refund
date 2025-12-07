import prisma from '../../config/db';
import { env } from '../../config/env';

// Mock Stripe
export async function createCheckoutSession(userId: number, documentId: number) {
  // In real app: stripe.checkout.sessions.create(...)
  // Return a dummy URL for now
  return {
    url: `https://checkout.stripe.com/pay/mock_session_${userId}_${documentId}`
  };
}

export async function handleWebhook(event: any) {
  // Mock logic to handle 'checkout.session.completed'
  // In real app: verify signature, extract metadata
  
  if (event.type === 'checkout.session.completed') {
    const { documentId, userId } = event.data.object.metadata;
    // Update DB
    await prisma.document.update({
      where: { id: Number(documentId) },
      data: { status: 'PAID' }
    });
    
    await prisma.payment.create({
      data: {
        userId: Number(userId),
        documentId: Number(documentId),
        stripeSessionId: event.data.object.id,
        amount: event.data.object.amount_total / 100,
        currency: event.data.object.currency,
        status: 'succeeded'
      }
    });
  }
}
