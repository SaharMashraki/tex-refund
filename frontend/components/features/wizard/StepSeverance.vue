<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('wizard.severance.title') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {{ $t('wizard.severance.description') }}
      </p>

      <div class="space-y-4">
        <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="formData.receivedSeverance" class="rounded text-primary-600 focus:ring-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.severance.received') }}</span>
        </label>

        <div v-if="formData.receivedSeverance" class="pl-6 space-y-4">
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ $t('wizard.severance.yearsWorked') }}
                    </label>
                    <input v-model.number="formData.yearsWorked" type="number" step="0.5" class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
                </div>
                 <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ $t('wizard.severance.lastSalary') }}
                    </label>
                    <input v-model.number="formData.lastSalary" type="number" class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
                </div>
             </div>

             <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ $t('wizard.severance.totalGrant') }}
                </label>
                <input v-model.number="formData.totalGrant" type="number" class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
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
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})
</script>
