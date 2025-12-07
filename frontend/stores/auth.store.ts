import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'
import type { User, LoginCredentials, RegisterData } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const data = await authService.login(credentials)
        this.user = data.user
        this.token = data.token
        
        // Store token in localStorage for persistence
        if (process.client) {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(userData: RegisterData) {
      try {
        const data = await authService.register(userData)
        this.user = data.user
        this.token = data.token
        
        // Store token in localStorage for persistence
        if (process.client) {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    async fetchProfile() {
      try {
        const user = await authService.getProfile()
        this.user = user
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user))
        }
      } catch (error) {
        console.error('Fetch profile error:', error)
        throw error
      }
    },

    async refreshToken() {
      try {
        const data = await authService.refreshToken()
        this.token = data.token
        
        if (process.client) {
          localStorage.setItem('auth_token', data.token)
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        throw error
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    },

    initializeAuth() {
      // Restore auth state from localStorage on app initialization
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          this.token = token
          try {
            this.user = JSON.parse(userStr)
          } catch (error) {
            console.error('Error parsing user data:', error)
            this.clearAuth()
          }
        }
      }
    }
  }
})
