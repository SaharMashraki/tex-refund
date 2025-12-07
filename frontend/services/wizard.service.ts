import { api } from './api'
import type { WizardFormData } from '~/types'

export const wizardService = {
  /**
   * Fetch saved draft from backend
   */
  async getDraft() {
    const response = await api.get<{ formData: WizardFormData; currentStep: number }>('/wizard/draft')
    return response.data.data
  },

  /**
   * Save form progress
   */
  async save(formData: Partial<WizardFormData>, currentStep: number) {
    const response = await api.post('/wizard/save', { formData, currentStep })
    return response.data
  },

  /**
   * Submit completed form
   */
  async submit(formData: WizardFormData) {
    const response = await api.post('/wizard/submit', formData)
    return response.data.data
  },

  /**
   * Get refund calculation
   */
  async calculate(formData: WizardFormData) {
    const response = await api.post<{ estimatedRefund: number; breakdown: any }>('/wizard/calculate', formData)
    return response.data.data
  }
}

export const getWizardDraft = wizardService.getDraft
export const saveWizardProgress = wizardService.save
export const submitWizardForm = wizardService.submit
export const calculateRefund = wizardService.calculate
