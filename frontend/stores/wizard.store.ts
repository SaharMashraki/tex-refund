import { defineStore } from 'pinia'
import { wizardService } from '~/services/wizard.service'
import type { WizardFormData } from '~/types'

interface WizardStep {
  id: number
  name: string
  title: string
  component: string
}

interface WizardState {
  currentStep: number
  steps: WizardStep[]
  formData: Partial<WizardFormData>
  status: 'draft' | 'submitted'
  lastSaved: Date | null
  isSaving: boolean
}

export const useWizardStore = defineStore('wizard', {
  state: (): WizardState => ({
    currentStep: 1,
    steps: [
      { id: 1, name: 'personal', title: 'Personal Information', component: 'StepPersonal' },
      { id: 2, name: 'family', title: 'Family Status', component: 'StepFamily' },
      { id: 3, name: 'children', title: 'Children & Maternity', component: 'StepChildren' },
      { id: 4, name: 'divorce', title: 'Divorce & Alimony', component: 'StepDivorce' },
      { id: 5, name: 'health', title: 'Health & Disability', component: 'StepHealth' },
      { id: 6, name: 'specialStatus', title: 'Special Status', component: 'StepSpecialStatus' },
      { id: 7, name: 'income', title: 'Income & Employment', component: 'StepIncome' },
      { id: 8, name: 'deductions', title: 'Deductions', component: 'StepDeductions' },
      { id: 9, name: 'severance', title: 'Severance & Grants', component: 'StepSeverance' },
      { id: 10, name: 'summary', title: 'Summary & Review', component: 'StepSummary' }
    ],
    formData: {},
    status: 'draft',
    lastSaved: null,
    isSaving: false
  }),

  getters: {
    currentStepData: (state) => state.steps.find(s => s.id === state.currentStep),
    isFirstStep: (state) => state.currentStep === 1,
    isLastStep: (state) => state.currentStep === state.steps.length,
    progress: (state) => (state.currentStep / state.steps.length) * 100
  },

  actions: {
    async initForm() {
      try {
        const data = await wizardService.getDraft()
        if (data) {
          this.formData = data.formData
          this.currentStep = data.currentStep
          this.status = 'draft'
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    },

    updateStepData(step: number, data: any) {
      const stepName = this.steps.find(s => s.id === step)?.name
      if (stepName) {
        this.formData = {
          ...this.formData,
          [stepName]: data
        }
      }
    },

    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    setCurrentStep(step: number) {
      if (step >= 1 && step <= this.steps.length) {
        this.currentStep = step
      }
    },

    async autoSave() {
      if (this.isSaving) return

      this.isSaving = true
      try {
        await wizardService.save(this.formData, this.currentStep)
        this.lastSaved = new Date()
      } catch (error) {
        console.error('Auto-save error:', error)
      } finally {
        this.isSaving = false
      }
    },

    async submitForm() {
      try {
        const result = await wizardService.submit(this.formData as WizardFormData)
        this.status = 'submitted'
        return result
      } catch (error) {
        console.error('Form submission error:', error)
        throw error
      }
    },

    async calculateRefund() {
      try {
        const result = await wizardService.calculate(this.formData as WizardFormData)
        return result
      } catch (error) {
        console.error('Refund calculation error:', error)
        throw error
      }
    },

    resetForm() {
      this.currentStep = 1
      this.formData = {}
      this.status = 'draft'
      this.lastSaved = null
    }
  }
})
