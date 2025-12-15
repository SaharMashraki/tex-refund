<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
        {{ $t('wizard.children.title') }}
      </h3>
      <button
        type="button"
        @click="addChild"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {{ $t('wizard.children.add') }}
      </button>
    </div>

    <div v-if="formData.children?.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ $t('wizard.children.noChildren') }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(child, index) in formData.children"
        :key="index"
        class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative"
      >
        <button
          @click="removeChild(index)"
          class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          <span class="sr-only">{{ $t('common.remove') }}</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ $t('wizard.children.birthYear') }}
            </label>
            <select
              v-model="child.birthYear"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
            >
              <option v-for="year in birthYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ $t('wizard.children.custody') }}
            </label>
            <select
              v-model="child.custody"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-primary-500"
            >
              <option value="full">{{ $t('wizard.children.custodyFull') }}</option>
              <option value="joint">{{ $t('wizard.children.custodyJoint') }}</option>
              <option value="other">{{ $t('wizard.children.custodyOther') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Maternity Leave check -->
    <div class="mt-4">
        <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="formData.maternityLeave" class="rounded text-primary-600 focus:ring-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('wizard.children.maternityLeave') }}</span>
        </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue || { children: [] },
  set: (value) => emit('update:modelValue', value)
})

const birthYears = Array.from({ length: 19 }, (_, i) => new Date().getFullYear() - i) // 0-18 years old

const addChild = () => {
  formData.value.children.push({
    birthYear: new Date().getFullYear(),
    custody: 'full'
  })
}

const removeChild = (index: number) => {
  formData.value.children.splice(index, 1)
}
</script>
