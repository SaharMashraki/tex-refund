import { useWizardStore } from '~/stores/wizard.store'
import { useDebounceFn } from '@vueuse/core'

export const useFormWizard = () => {
  const wizardStore = useWizardStore()
  const router = useRouter()

  const currentStep = computed(() => wizardStore.currentStep)
  const totalSteps = computed(() => wizardStore.steps.length)
  const formData = computed(() => wizardStore.formData)
  const canGoNext = computed(() => currentStep.value < totalSteps.value)
  const canGoPrevious = computed(() => currentStep.value > 1)
  const progress = computed(() => (currentStep.value / totalSteps.value) * 100)

  const nextStep = async () => {
    if (!canGoNext.value) return

    // Validate current step before proceeding
    const isValid = await validateCurrentStep()
    if (!isValid) {
      throw new Error('Please fix validation errors before continuing')
    }

    wizardStore.nextStep()
    await router.push(`/form/step-${currentStep.value}`)
  }

  const prevStep = async () => {
    if (!canGoPrevious.value) return

    wizardStore.prevStep()
    await router.push(`/form/step-${currentStep.value}`)
  }

  const jumpToStep = async (step: number) => {
    if (step < 1 || step > totalSteps.value) return
    if (step > currentStep.value) {
      // Can't jump ahead without completing current step
      return
    }

    wizardStore.setCurrentStep(step)
    await router.push(`/form/step-${step}`)
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    // Implement step-specific validation logic here
    // For now, return true
    return true
  }

  const updateStepData = (step: number, data: any) => {
    wizardStore.updateStepData(step, data)
    debouncedAutoSave()
  }

  const debouncedAutoSave = useDebounceFn(async () => {
    await wizardStore.autoSave()
  }, 1000)

  return {
    currentStep,
    totalSteps,
    formData,
    canGoNext,
    canGoPrevious,
    progress,
    nextStep,
    prevStep,
    jumpToStep,
    updateStepData,
    validateCurrentStep
  }
}
