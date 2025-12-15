<template>
  <div class="space-y-6">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ $t('wizard.divorce.description') }}
    </p>

    <div class="space-y-4">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="paysChildSupport"
            v-model="formData.paysChildSupport"
            type="checkbox"
            class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="paysChildSupport" class="font-medium text-gray-700 dark:text-gray-200">
            {{ $t('wizard.divorce.paysChildSupport') }}
          </label>
          <p class="text-gray-500 dark:text-gray-400">{{ $t('wizard.divorce.paysChildSupportHint') }}</p>
        </div>
      </div>

      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="remarried"
            v-model="formData.remarried"
            type="checkbox"
            class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="remarried" class="font-medium text-gray-700 dark:text-gray-200">
            {{ $t('wizard.divorce.remarried') }}
          </label>
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
