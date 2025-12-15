<template>
  <NuxtLayout name="default">
    <div class="container mx-auto px-4 py-8">
      <div v-if="currentStep" class="max-w-4xl mx-auto">
        <!-- Progress bar could go here -->
        
        <component 
          :is="currentStep.component" 
          @next="handleNext" 
          @prev="handlePrev" 
        />
        
      </div>
      <div v-else class="text-center py-12">
        <h2 class="text-xl font-bold text-red-500 mb-4">{{ $t('common.errors.pageNotFound') }}</h2>
        <button @click="router.push('/dashboard')" class="btn btn-primary">
          {{ $t('common.buttons.backToDashboard') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
import StepPersonal from '~/components/features/wizard/StepPersonal.vue'
import StepFamily from '~/components/features/wizard/StepFamily.vue'
import StepChildren from '~/components/features/wizard/StepChildren.vue'
import StepDivorce from '~/components/features/wizard/StepDivorce.vue'
import StepHealth from '~/components/features/wizard/StepHealth.vue'
import StepSpecialStatus from '~/components/features/wizard/StepSpecialStatus.vue'
import StepIncome from '~/components/features/wizard/StepIncome.vue'
import StepDeductions from '~/components/features/wizard/StepDeductions.vue'
import StepSeverance from '~/components/features/wizard/StepSeverance.vue'
import StepSummary from '~/components/features/wizard/StepSummary.vue'

const componentMap: Record<string, any> = {
  StepPersonal,
  StepFamily,
  StepChildren,
  StepDivorce,
  StepHealth,
  StepSpecialStatus,
  StepIncome,
  StepDeductions,
  StepSeverance,
  StepSummary
}

const route = useRoute()
const router = useRouter()
const wizardStore = useWizardStore()

const stepId = computed(() => {
  const slug = route.params.slug as string
  const match = slug?.match(/^step-(\d+)$/)
  if (match) {
    return parseInt(match[1])
  }
  return 1
})

const currentStep = computed(() => {
  const step = wizardStore.steps.find(s => s.id === stepId.value)
  if (!step) return null
  
  return {
    ...step,
    component: componentMap[step.component]
  }
})

// Initialize store step on mount or param change
watch(stepId, (newId) => {
  if (wizardStore.steps.some(s => s.id === newId)) {
    wizardStore.setCurrentStep(newId)
  }
}, { immediate: true })

const handleNext = () => {
    wizardStore.nextStep()
    router.push(localePath(`/form/step-${wizardStore.currentStep}`))
    wizardStore.autoSave()
}

const handlePrev = () => {
    wizardStore.prevStep()
    router.push(localePath(`/form/step-${wizardStore.currentStep}`))
}

// SEO
useHead({
  title: computed(() => currentStep.value ? `${currentStep.value.title} - Tax Refund` : 'Step Not Found')
})

definePageMeta({
  middleware: 'auth'
})
</script>
