<template>
  <div class="space-y-6">
    <!-- Aliyah / Immigration -->
    <div class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('wizard.special.immigration') }}</h3>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.special.aliyahDate') }}
        </label>
        <input
          v-model="formData.aliyahDate"
          type="date"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        />
      </div>

      <div class="flex items-center space-x-2">
        <input type="checkbox" v-model="formData.isReturningResident" class="rounded text-primary-600 focus:ring-primary-500" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.special.returningResident') }}</span>
      </div>
    </div>

    <!-- Army Service -->
    <div class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('wizard.special.army') }}</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ $t('wizard.special.serviceMonths') }}
          </label>
           <input
            v-model.number="formData.serviceMonths"
            type="number"
            min="0"
            max="60"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ $t('wizard.special.dischargeDate') }}
          </label>
          <input
            v-model="formData.dischargeDate"
            type="date"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>

    <!-- Periphery -->
    <div class="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('wizard.special.periphery') }}</h3>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('wizard.special.locality') }}
        </label>
        <select
          v-model="formData.locality"
          class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
        >
          <option value="">{{ $t('common.select') }}</option>
          <option value="kiryat_shmona">Kiryat Shmona</option>
          <option value="sderot">Sderot</option>
          <!-- Add more based on backend list -->
        </select>
      </div>
      
      <div v-if="formData.locality" class="flex items-center space-x-2">
        <input type="checkbox" v-model="formData.livedTwelveMonths" class="rounded text-primary-600 focus:ring-primary-500" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.special.livedTwelveMonths') }}</span>
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
