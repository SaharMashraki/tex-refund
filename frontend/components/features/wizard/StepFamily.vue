<template>
  <div class="space-y-6">
    <!-- Marital Status -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ $t('wizard.family.status') }}
      </label>
      <select
        v-model="formData.maritalStatus"
        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
      >
        <option value="single">{{ $t('status.single') }}</option>
        <option value="married">{{ $t('status.married') }}</option>
        <option value="divorced">{{ $t('status.divorced') }}</option>
        <option value="widowed">{{ $t('status.widowed') }}</option>
      </select>
    </div>

    <!-- Spouse Details (if Married) -->
    <div v-if="formData.maritalStatus === 'married'" class="space-y-4 border-l-4 border-primary-500 pl-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
        {{ $t('wizard.family.spouseDetails') }}
      </h3>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.family.spouseName') }}
        </label>
        <input
          v-model="formData.spouseName"
          type="text"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.family.spouseId') }}
        </label>
        <input
          v-model="formData.spouseId"
          type="text"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.family.spouseWorkStatus') }}
        </label>
        <select
          v-model="formData.spouseWorkStatus"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        >
          <option value="working">{{ $t('status.working') }}</option>
          <option value="not_working">{{ $t('status.not_working') }}</option>
          <option value="retired">{{ $t('status.retired') }}</option>
          <option value="disabled">{{ $t('status.disabled') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any
  errors?: Record<string, string>
}>()

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue || { maritalStatus: 'single' },
  set: (value) => emit('update:modelValue', value)
})
</script>
