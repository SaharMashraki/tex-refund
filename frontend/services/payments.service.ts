import { api } from './api'
import type { CheckoutSession, Payment } from '~/types'

export const paymentsService = {
  /**
   * Create checkout session for document payment
   */
  async createCheckout(documentId: number) {
    const response = await api.post<CheckoutSession>('/payments/checkout', { documentId })
    return response.data.data
  },

  /**
   * Get payment status for a document
   */
  async getStatus(documentId: number) {
    const response = await api.get<Payment>(`/payments/status/${documentId}`)
    return response.data.data
  }
}

export const createCheckoutSession = paymentsService.createCheckout
export const getPaymentStatus = paymentsService.getStatus
