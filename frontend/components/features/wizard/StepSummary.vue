<template>
  <div class="space-y-8">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('wizard.summary.title') }}
      </h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{ $t('wizard.summary.subtitle') }}
      </p>
    </div>

    <!-- Read-only sections for review -->
    <div class="space-y-4">
        <!-- Personal Info -->
        <section class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
             <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('wizard.personal.title') }}</h3>
                <button @click="$emit('edit', 1)" class="text-sm text-primary-600 hover:text-primary-700">{{ $t('common.edit') }}</button>
             </div>
             <div class="grid grid-cols-2 gap-4 text-sm">
                 <div>
                     <span class="block text-gray-500">{{ $t('wizard.personal.fullName') }}</span>
                     <span class="font-medium dark:text-gray-200">{{ formData.personal?.fullName }}</span>
                 </div>
                 <div>
                     <span class="block text-gray-500">{{ $t('wizard.personal.idNumber') }}</span>
                     <span class="font-medium dark:text-gray-200">{{ formData.personal?.idNumber }}</span>
                 </div>
                 <!-- Add other fields as needed for summary -->
             </div>
        </section>
        
        <!-- Add sections for other steps similarly... -->
        <!-- Keeping it brief for now, but in prod would list all important sections -->
    </div>

    <div class="flex justify-center pt-6">
        <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="confirmed" class="rounded text-primary-600 focus:ring-primary-500 w-5 h-5" />
            <span class="text-base text-gray-700 dark:text-gray-200">{{ $t('wizard.summary.confirmAccuracy') }}</span>
        </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWizardStore } from '~/stores/wizard.store'

const store = useWizardStore()
const formData = computed(() => store.formData)
const confirmed = ref(false)

defineEmits(['edit'])

defineExpose({
    isConfirmed: () => confirmed.value
})
</script>
