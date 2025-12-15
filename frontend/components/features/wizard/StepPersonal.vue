<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Full Name -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.personal.fullName') }}
        </label>
        <input
          v-model="formData.fullName"
          type="text"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          :class="{ 'border-red-500': errors.fullName }"
        />
        <p v-if="errors.fullName" class="text-sm text-red-500">{{ errors.fullName }}</p>
      </div>

      <!-- ID Number -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.personal.idNumber') }}
        </label>
        <input
          v-model="formData.idNumber"
          type="text"
          maxlength="9"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          :class="{ 'border-red-500': errors.idNumber }"
        />
        <p v-if="errors.idNumber" class="text-sm text-red-500">{{ errors.idNumber }}</p>
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.personal.email') }}
        </label>
        <input
          v-model="formData.email"
          type="email"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.personal.phone') }}
        </label>
        <input
          v-model="formData.phone"
          type="tel"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          :class="{ 'border-red-500': errors.phone }"
        />
        <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
      </div>
    </div>

    <!-- Address -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ $t('wizard.personal.address') }}
      </label>
      <input
        v-model="formData.address"
        type="text"
        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        :class="{ 'border-red-500': errors.address }"
      />
      <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
    </div>

    <!-- Tax Years Selection -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ $t('wizard.personal.years') }}
      </label>
      <div class="grid grid-cols-3 gap-4">
        <label
          v-for="year in availableYears"
          :key="year"
          class="flex items-center space-x-2 cursor-pointer p-3 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="{ 'bg-primary-50 dark:bg-primary-900 border-primary-500': formData.years?.includes(year) }"
        >
          <input
            type="checkbox"
            :value="year"
            v-model="formData.years"
            class="rounded text-primary-600 focus:ring-primary-500"
          />
          <span>{{ year }}</span>
        </label>
      </div>
      <p v-if="errors.years" class="text-sm text-red-500">{{ errors.years }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const props = defineProps<{
  modelValue: any
  errors?: Record<string, string>
}>()

const emit = defineEmits(['update:modelValue', 'validate'])

const formData = computed({
  get: () => props.modelValue || { years: [] },
  set: (value) => emit('update:modelValue', value)
})

const availableYears = [2019, 2020, 2021, 2022, 2023, 2024]
</script>
