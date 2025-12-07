<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-surface-elevated border-b border-default backdrop-blur-sm bg-opacity-90">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/dashboard" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg"></div>
            <span class="text-xl font-bold">Tax Refund</span>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/dashboard"
              class="text-sm font-medium hover:text-primary-500 transition-colors"
            >
              {{ $t('dashboard.title') || 'Dashboard' }}
            </NuxtLink>
            <NuxtLink
              to="/documents"
              class="text-sm font-medium hover:text-primary-500 transition-colors"
            >
              {{ $t('documents.title') || 'Documents' }}
            </NuxtLink>
          </nav>

          <!-- Right side actions -->
          <div class="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            
            <!-- User menu -->
            <div class="ltr:ml-4 rtl:mr-4 flex items-center gap-3">
              <span class="text-sm font-medium hidden md:block">{{ userName }}</span>
              <button
                @click="handleLogout"
                class="btn btn-ghost"
              >
                {{ $t('common.buttons.logout') || 'Logout' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-surface-elevated border-t border-default mt-auto">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-sm text-muted">
          <p>&copy; {{ currentYear }} Tax Refund Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import LanguageSelector from '~/components/common/LanguageSelector.vue'
import ThemeToggle from '~/components/common/ThemeToggle.vue'

const { user, logout } = useAuth()

const userName = computed(() => user.value?.name || '')
const currentYear = new Date().getFullYear()

const handleLogout = async () => {
  await logout()
}
</script>
