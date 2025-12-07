import { useAuthStore } from '~/stores/auth.store'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await authStore.login(credentials)
      await router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      await router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      await authStore.register(userData)
      await router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    login,
    logout,
    register
  }
}
