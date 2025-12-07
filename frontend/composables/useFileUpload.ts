import { ref } from 'vue'
import { uploadDocument } from '~/services/documents.service'

export const useFileUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PDF, DOCX, or image files only.'
      }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit.'
      }
    }

    return { valid: true }
  }

  const uploadFile = async (file: File) => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      error.value = validation.error || 'Invalid file'
      throw new Error(validation.error)
    }

    isUploading.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      const result = await uploadDocument(file, (progress) => {
        uploadProgress.value = progress
      })

      return result
    } catch (err: any) {
      error.value = err.message || 'Upload failed'
      throw err
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  const uploadMultiple = async (files: File[]) => {
    const results = []
    
    for (const file of files) {
      try {
        const result = await uploadFile(file)
        results.push({ file, result, success: true })
      } catch (err) {
        results.push({ file, error: err, success: false })
      }
    }

    return results
  }

  const reset = () => {
    isUploading.value = false
    uploadProgress.value = 0
    error.value = null
  }

  return {
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    error: readonly(error),
    validateFile,
    uploadFile,
    uploadMultiple,
    reset
  }
}
