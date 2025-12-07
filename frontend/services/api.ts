import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '~/types'

class ApiClient {
  private instance: AxiosInstance | null = null

  private getInstance(): AxiosInstance {
    if (!this.instance) {
      // Get API base URL from environment or use default
      const apiBase = process.client 
        ? (window as any).__NUXT__?.config?.public?.apiBase || 'http://localhost:3001/api/v1'
        : 'http://localhost:3001/api/v1'
      
      this.instance = axios.create({
        baseURL: apiBase,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.setupInterceptors()
    }
    
    return this.instance
  }

  private setupInterceptors() {
    if (!this.instance) return

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Auto-inject JWT token from localStorage
        if (process.client) {
          const token = localStorage.getItem('auth_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error: AxiosError<ApiError>) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized - clear auth and redirect to login
              if (process.client) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                window.location.href = '/login'
              }
              break

            case 403:
              // Forbidden
              console.error('Access denied:', error.response.data)
              break

            case 404:
              // Not found
              console.error('Resource not found:', error.response.data)
              break

            case 422:
              // Validation error
              console.error('Validation error:', error.response.data)
              break

            case 500:
              // Server error
              console.error('Server error:', error.response.data)
              if (process.client) {
                console.error('Server error occurred')
              }
              break

            default:
              console.error('API error:', error.response.data)
          }
        } else if (error.request) {
          // Network error
          console.error('Network error:', error.message)
          if (process.client) {
            console.error('Network error. Please check your connection.')
          }
        }

        return Promise.reject(error)
      }
    )
  }

  public get<T = any>(url: string, config = {}) {
    return this.getInstance().get<ApiResponse<T>>(url, config)
  }

  public post<T = any>(url: string, data?: any, config = {}) {
    return this.getInstance().post<ApiResponse<T>>(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config = {}) {
    return this.getInstance().put<ApiResponse<T>>(url, data, config)
  }

  public patch<T = any>(url: string, data?: any, config = {}) {
    return this.getInstance().patch<ApiResponse<T>>(url, data, config)
  }

  public delete<T = any>(url: string, config = {}) {
    return this.getInstance().delete<ApiResponse<T>>(url, config)
  }

  public getAxiosInstance(): AxiosInstance {
    return this.getInstance()
  }
}

// Create singleton instance
const apiClient = new ApiClient()

export const api = apiClient
export default apiClient.getAxiosInstance()
