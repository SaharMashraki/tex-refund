<template>
  <div class="relative">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
    >
      <span class="text-2xl">{{ currentLocale.flag }}</span>
      <span class="text-sm font-medium">{{ currentLocale.name }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        v-click-outside="() => isOpen = false"
        class="absolute top-full mt-2 ltr:right-0 rtl:left-0 bg-surface-elevated border border-default rounded-lg shadow-lg overflow-hidden z-50 min-w-[150px]"
      >
        <button
          v-for="locale in locales"
          :key="locale.code"
          type="button"
          @click="selectLocale(locale.code)"
          class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors text-left"
          :class="{ 'bg-primary-50 dark:bg-primary-950': currentLocale.code === locale.code }"
        >
          <span class="text-2xl">{{ locale.flag }}</span>
          <span class="text-sm font-medium">{{ locale.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'he', name: 'עברית', flag: '🇮🇱', dir: 'rtl' }
]

const currentLocale = computed(() => {
  return locales.find(l => l.code === locale.value) || locales[0]
})

const selectLocale = (code: string) => {
  locale.value = code
  isOpen.value = false
  
  // Update document direction
  if (process.client) {
    const selectedLocale = locales.find(l => l.code === code)
    document.documentElement.dir = selectedLocale?.dir || 'ltr'
    document.documentElement.lang = code
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
