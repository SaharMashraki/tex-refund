import { api } from './api'
import type { User, LoginCredentials, RegisterData } from '~/types'

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials) {
    console.log(credentials)
    const response = await api.post<{ user: User; token: string }>('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  async register(userData: RegisterData) {
    const response = await api.post<{ user: User; token: string }>('/auth/register', userData)
    return response.data.data
  },

  /**
   * Refresh JWT token
   */
  async refreshToken() {
    const response = await api.post<{ token: string }>('/auth/refresh')
    return response.data.data
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await api.get<User>('/auth/profile')
    return response.data.data
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  }
}
