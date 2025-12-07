import { defineStore } from 'pinia'
import { documentsService } from '~/services/documents.service'
import type { Document } from '~/types'

interface DocumentsState {
  documents: Document[]
  currentDocument: Document | null
  uploadProgress: number
  isLoading: boolean
}

export const useDocumentsStore = defineStore('documents', {
  state: (): DocumentsState => ({
    documents: [],
    currentDocument: null,
    uploadProgress: 0,
    isLoading: false
  }),

  getters: {
    documentById: (state) => (id: number) => {
      return state.documents.find(doc => doc.id === id)
    },
    
    documentsByStatus: (state) => (status: string) => {
      return state.documents.filter(doc => doc.status === status)
    },

    totalDocuments: (state) => state.documents.length
  },

  actions: {
    async fetchDocuments(params?: { page?: number; limit?: number; status?: string }) {
      this.isLoading = true
      try {
        const response = await documentsService.list(params)
        this.documents = response.data
        return response
      } catch (error) {
        console.error('Error fetching documents:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchDocumentDetails(id: number) {
      this.isLoading = true
      try {
        const document = await documentsService.getById(id)
        this.currentDocument = document
        
        // Update in documents array if exists
        const index = this.documents.findIndex(doc => doc.id === id)
        if (index !== -1) {
          this.documents[index] = document
        } else {
          this.documents.push(document)
        }
        
        return document
      } catch (error) {
        console.error('Error fetching document details:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async uploadDocument(file: File) {
      this.uploadProgress = 0
      try {
        const document = await documentsService.upload(file, (progress) => {
          this.uploadProgress = progress
        })
        
        // Add to documents array
        this.documents.unshift(document)
        
        return document
      } catch (error) {
        console.error('Error uploading document:', error)
        throw error
      } finally {
        this.uploadProgress = 0
      }
    },

    async deleteDocument(id: number) {
      try {
        await documentsService.delete(id)
        
        // Remove from documents array
        this.documents = this.documents.filter(doc => doc.id !== id)
        
        // Clear current document if it was deleted
        if (this.currentDocument?.id === id) {
          this.currentDocument = null
        }
      } catch (error) {
        console.error('Error deleting document:', error)
        throw error
      }
    },

    async downloadDocument(id: number) {
      try {
        const data = await documentsService.download(id)
        
        // Open download URL in new tab
        if (process.client && data.url) {
          window.open(data.url, '_blank')
        }
        
        return data
      } catch (error) {
        console.error('Error downloading document:', error)
        throw error
      }
    },

    clearCurrentDocument() {
      this.currentDocument = null
    }
  }
})
