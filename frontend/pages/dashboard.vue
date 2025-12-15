<template>
  <NuxtLayout name="default">
    <div class="container mx-auto px-4 py-8">
      <!-- Welcome section -->
      <div class="mb-8 animate-fade-in">
        <h1 class="text-3xl font-bold mb-2">
          {{ $t('dashboard.welcome') }}, {{ userName }}!
        </h1>
        <p class="text-muted">{{ $t('dashboard.subtitle') }}</p>
      </div>

      <!-- Action cards -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Start new form card -->
        <div class="card card-hoverable p-6 cursor-pointer" @click="startNewForm">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-primary-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-1">{{ $t('dashboard.startNew') }}</h3>
              <p class="text-sm text-muted">Begin a new tax refund calculation for the past 6 years</p>
            </div>
          </div>
        </div>

        <!-- Resume saved form card -->
        <div class="card card-hoverable p-6 cursor-pointer" @click="resumeForm">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-secondary-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-1">{{ $t('dashboard.resumeSaved') }}</h3>
              <p class="text-sm text-muted">Continue where you left off</p>
              <div v-if="wizardProgress > 0" class="mt-3">
                <div class="flex items-center justify-between text-xs text-muted mb-1">
                  <span>Progress</span>
                  <span>{{ Math.round(wizardProgress) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-secondary-600 h-2 rounded-full transition-all" :style="{ width: `${wizardProgress}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted mb-1">{{ $t('dashboard.stats.documentsUploaded') }}</p>
              <p class="text-2xl font-bold">{{ stats.documentsUploaded }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted mb-1">{{ $t('dashboard.stats.formsCompleted') }}</p>
              <p class="text-2xl font-bold">{{ stats.formsCompleted }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted mb-1">{{ $t('dashboard.estimatedRefund') }}</p>
              <p class="text-2xl font-bold text-green-600">₪{{ stats.estimatedRefund.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent documents -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('dashboard.yourDocuments') }}</h2>
        <div v-if="documents.length > 0" class="space-y-3">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
            @click="viewDocument(doc.id)"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-600">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p class="font-medium">{{ doc.originalName }}</p>
                <p class="text-sm text-muted">{{ formatDate(doc.createdAt) }}</p>
              </div>
            </div>
            <span class="badge badge-primary">{{ doc.status }}</span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-muted">
          <p>{{ $t('common.messages.noData') }}</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useWizardStore } from '~/stores/wizard.store'
import { useDocumentsStore } from '~/stores/documents.store'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const wizardStore = useWizardStore()
const documentsStore = useDocumentsStore()
const router = useRouter()

const userName = computed(() => user.value?.name || '')
const wizardProgress = computed(() => wizardStore.progress)
const documents = computed(() => documentsStore.documents.slice(0, 5)) // Show only 5 recent

const stats = ref({
  documentsUploaded: 0,
  formsCompleted: 0,
  estimatedRefund: 0
})

onMounted(async () => {
  // Load wizard draft
  await wizardStore.initForm()
  
  // Load documents
  await documentsStore.fetchDocuments({ limit: 5 })
  
  // Update stats
  stats.value.documentsUploaded = documentsStore.totalDocuments
  stats.value.formsCompleted = wizardStore.status === 'submitted' ? 1 : 0
})

const localePath = useLocalePath()

const startNewForm = () => {
  wizardStore.resetForm()
  router.push(localePath('/form/step-1'))
}

const resumeForm = () => {
  router.push(localePath(`/form/step-${wizardStore.currentStep}`))
}

const viewDocument = (id: number) => {
  router.push(localePath(`/documents/${id}`))
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
