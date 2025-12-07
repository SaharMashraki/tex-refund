import { defineNuxtRouteMiddleware } from "nuxt/app"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Initialize auth state from localStorage if not already done
  if (!authStore.isAuthenticated && process.client) {
    authStore.initializeAuth()
  }

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
