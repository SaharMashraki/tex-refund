<template>
  <div v-if="tags?.length" class="flex flex-wrap gap-2">
    <span
      v-for="(tagItem, index) in tags"
      :key="index"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
    >
      {{ displayLabel(tagItem.tag) }}
      <span v-if="tagItem.confidence" class="ml-1 text-primary-600 dark:text-primary-400">
        {{ Math.round(tagItem.confidence * 100) }}%
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: Array<{
    confidence?: number
    tag: {
      labelEn: string
      labelHe: string
    }
  }>
}>()

const { locale } = useI18n()

const displayLabel = (tag: any) => {
  return locale.value === 'he' ? tag.labelHe : tag.labelEn
}
</script>
