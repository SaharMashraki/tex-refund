<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()

useHead({
  htmlAttrs: {
    dir: computed(() => {
      const current = locales.value.find(l => l.code === locale.value)
      return current?.dir || 'ltr'
    }),
    lang: computed(() => locale.value)
  }
})
</script>
