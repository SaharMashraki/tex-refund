<template>
  <NuxtLayout name="public">
    <div class="card p-8 animate-fade-in">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4"></div>
        <h1 class="text-2xl font-bold mb-2">{{ $t('auth.register.title') }}</h1>
        <p class="text-muted">{{ $t('auth.register.subtitle') }}</p>
      </div>

      <!-- Register form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <AppInput
          v-model="name"
          type="text"
          :label="$t('common.labels.name')"
          :placeholder="$t('auth.register.namePlaceholder')"
          :error="errors.name"
          required
        />

        <AppInput
          v-model="email"
          type="email"
          :label="$t('common.labels.email')"
          :placeholder="$t('auth.register.emailPlaceholder')"
          :error="errors.email"
          required
        />

        <AppInput
          v-model="password"
          type="password"
          :label="$t('common.labels.password')"
          :placeholder="$t('auth.register.passwordPlaceholder')"
          :error="errors.password"
          required
        />

        <AppInput
          v-model="confirmPassword"
          type="password"
          :label="$t('common.labels.confirmPassword')"
          :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
          :error="errors.confirmPassword"
          required
        />

        <div class="flex items-start gap-2">
          <input
            v-model="agreeToTerms"
            type="checkbox"
            id="terms"
            class="w-4 h-4 mt-1 rounded border-default text-primary-600 focus:ring-primary-500"
          />
          <label for="terms" class="text-sm">
            {{ $t('auth.register.agreeToTerms') }}
          </label>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoading"
          class="w-full"
        >
          {{ $t('auth.register.registerButton') }}
        </AppButton>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-default"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-surface-elevated text-muted">{{ $t('auth.login.orContinueWith') }}</span>
        </div>
      </div>

      <!-- Social login (placeholder) -->
      <div class="grid grid-cols-2 gap-3">
        <button type="button" class="btn btn-outline">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button type="button" class="btn btn-outline">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <!-- Sign in link -->
      <p class="mt-6 text-center text-sm text-muted">
        {{ $t('auth.register.haveAccount') }}
        <NuxtLink to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
          {{ $t('auth.register.signIn') }}
        </NuxtLink>
      </p>
    </div>

    <!-- Theme and language toggles -->
    <div class="fixed top-4 ltr:right-4 rtl:left-4 flex items-center gap-2">
      <LanguageSelector />
      <ThemeToggle />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest',
  layout: false
})

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const isLoading = ref(false)
const errors = ref<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})

const handleRegister = async () => {
  // Clear previous errors
  errors.value = {}

  // Basic validation
  if (!name.value) {
    errors.value.name = 'Name is required'
    return
  }
  if (!email.value) {
    errors.value.email = 'Email is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }
  if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    return
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }
  if (!agreeToTerms.value) {
    errors.value.name = 'You must agree to the terms and conditions'
    return
  }

  isLoading.value = true

  try {
    await register({ 
      name: name.value, 
      email: email.value, 
      password: password.value 
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    errors.value.email = error.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
