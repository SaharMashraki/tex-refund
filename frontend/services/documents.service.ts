import { api } from './api'
import type { Document, PaginatedResponse } from '~/types'

export const documentsService = {
  /**
   * Upload a document
   */
  async upload(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      }
    })

    return response.data.data
  },

  /**
   * Get list of user documents
   */
  async list(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get<PaginatedResponse<Document>>('/documents', { params })
    return response.data.data
  },

  /**
   * Get document details with tags
   */
  async getById(id: number) {
    const response = await api.get<Document>(`/documents/${id}`)
    return response.data.data
  },

  /**
   * Download document
   */
  async download(id: number) {
    const response = await api.get<{ url: string }>(`/documents/${id}/download`)
    return response.data.data
  },

  /**
   * Delete document
   */
  async delete(id: number) {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  }
}

// Export individual functions for convenience
export const uploadDocument = documentsService.upload
export const listDocuments = documentsService.list
export const getDocumentById = documentsService.getById
export const downloadDocument = documentsService.download
export const deleteDocument = documentsService.delete
