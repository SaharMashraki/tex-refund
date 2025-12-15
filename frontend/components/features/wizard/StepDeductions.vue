<template>
  <div class="space-y-6">
    <!-- Donations -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('wizard.deductions.donations') }}
      </h3>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
            <input type="checkbox" v-model="formData.hasDonations" class="rounded text-primary-600 focus:ring-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.deductions.donated') }}</span>
        </div>

        <div v-if="formData.hasDonations" class="pl-6 space-y-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ $t('wizard.deductions.totalAmount') }}
                </label>
                <div class="relative rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 sm:text-sm">₪</span>
                    </div>
                    <input v-model="formData.donationAmount" type="number" class="pl-7 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
                </div>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-dashed border-gray-300">
                <p class="text-sm text-center text-gray-500">{{ $t('wizard.deductions.uploadReceipts') }}</p>
            </div>
        </div>
      </div>
    </div>

    <!-- Life Insurance -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {{ $t('wizard.deductions.insurance') }}
      </h3>
      
      <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <input type="checkbox" v-model="formData.hasLifeInsurance" class="rounded text-primary-600 focus:ring-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.deductions.hasInsurance') }}</span>
        </div>
        
        <div v-if="formData.hasLifeInsurance" class="pl-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {{ $t('wizard.deductions.depositAmount') }}
                </label>
                <div class="relative rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 sm:text-sm">₪</span>
                    </div>
                    <input v-model="formData.lifeInsuranceAmount" type="number" class="pl-7 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800" />
                </div>
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
