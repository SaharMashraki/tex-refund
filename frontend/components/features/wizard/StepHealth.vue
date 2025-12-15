<template>
  <div class="space-y-6">
    <!-- Disability Section -->
    <div class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="hasDisability"
            v-model="formData.hasDisability"
            type="checkbox"
            class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="hasDisability" class="font-medium text-gray-700 dark:text-gray-200">
            {{ $t('wizard.health.hasDisability') }}
          </label>
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('wizard.health.disabilityHint') }}
          </p>
        </div>
      </div>
          
      <div v-if="formData.hasDisability" class="ml-7 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-dashed border-gray-300 dark:border-gray-600">
         <p class="text-sm font-medium mb-2">{{ $t('wizard.health.uploadMedicalDocs') }}</p>
         <!-- Placeholder for File Upload Component -->
         <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>{{ $t('common.uploadFile') }}</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                </label>
                <p class="pl-1">{{ $t('common.orDragDrop') }}</p>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
         </div>
      </div>
    </div>

    <!-- Nursing Home Section -->
    <div class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="nursingHome"
            v-model="formData.hasNursingHomeExpenses"
            type="checkbox"
            class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="nursingHome" class="font-medium text-gray-700 dark:text-gray-200">
             {{ $t('wizard.health.nursingHome') }}
          </label>
           <p class="text-gray-500 dark:text-gray-400">
            {{ $t('wizard.health.nursingHomeHint') }}
          </p>
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
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})
</script>
