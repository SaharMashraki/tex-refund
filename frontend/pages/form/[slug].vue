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
const route = useRoute()
const router = useRouter()
const wizardStore = useWizardStore()

const stepId = computed(() => {
  const slug = route.params.slug as string
  // Extract number from "step-N"
  const match = slug?.match(/^step-(\d+)$/)
  if (match) {
    return parseInt(match[1])
  }
  return 1 // Default or invalid fallbacks
})

const currentStep = computed(() => wizardStore.steps.find(s => s.id === stepId.value))

// Initialize store step on mount or param change
watch(stepId, (newId) => {
  if (wizardStore.steps.some(s => s.id === newId)) {
    wizardStore.setCurrentStep(newId)
  }
}, { immediate: true })

const handleNext = () => {
    wizardStore.nextStep()
    router.push(`/form/step-${wizardStore.currentStep}`)
    wizardStore.autoSave()
}

const handlePrev = () => {
    wizardStore.prevStep()
    router.push(`/form/step-${wizardStore.currentStep}`)
}

// SEO
useHead({
  title: computed(() => currentStep.value ? `${currentStep.value.title} - Tax Refund` : 'Step Not Found')
})

definePageMeta({
  middleware: 'auth'
})
</script>
