<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('wizard.income.title') }}
      </h3>
      
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {{ $t('wizard.income.description') }}
      </p>

      <!-- Form 106 Upload -->
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.income.form106') }}
        </label>
        
        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-500 transition-colors">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-600 dark:text-gray-400">
              <label for="form106-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500">
                <span>{{ $t('common.uploadFile') }}</span>
                <input id="form106-upload" name="form106-upload" type="file" class="sr-only" multiple />
              </label>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              PDF, JPG, PNG
            </p>
          </div>
        </div>

        <!-- List of uploaded files (Mock) -->
        <div v-if="formData.incomeDocs?.length" class="mt-4 space-y-2">
            <div v-for="(doc, idx) in formData.incomeDocs" :key="idx" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <span class="text-sm truncate">{{ doc.name }}</span>
                <button class="text-red-500 hover:text-red-700 text-sm">{{ $t('common.remove') }}</button>
            </div>
        </div>
      </div>

      <!-- Manual Input Fallback -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
         <div class="flex items-center justify-between cursor-pointer" @click="showManualInput = !showManualInput">
            <h4 class="text-base font-medium text-gray-900 dark:text-gray-100">
                {{ $t('wizard.income.manualInput') }}
            </h4>
            <span class="text-gray-500">{{ showManualInput ? '-' : '+' }}</span>
         </div>
         
         <div v-if="showManualInput" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ $t('wizard.income.annualSalary') }}
                </label>
                <input v-model="formData.annualSalary" type="number" class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ $t('wizard.income.taxPaid') }}
                </label>
                <input v-model="formData.taxPaid" type="number" class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue || { incomeDocs: [] },
  set: (value) => emit('update:modelValue', value)
})

const showManualInput = ref(false)
</script>
