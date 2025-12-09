import { api } from './api'
import type { Tag } from '~/types'

export const tagsService = {
  /**
   * Get all available tags from the database
   * Tags include bilingual labels (English and Hebrew)
   */
  async getAll() {
    const response = await api.get<Tag[]>('/tags')
    return response.data.data
  },

  /**
   * Get tags by category
   * @param category - The category to filter by (e.g., 'income', 'deductions', 'health')
   */
  async getByCategory(category: string) {
    const response = await api.get<Tag[]>(`/tags?category=${category}`)
    return response.data.data
  },

  /**
   * Get a single tag by ID
   * @param id - The tag ID
   */
  async getById(id: number) {
    const response = await api.get<Tag>(`/tags/${id}`)
    return response.data.data
  },

  /**
   * Helper function to get the display label based on current locale
   * @param tag - The tag object
   * @param locale - The current locale ('en' or 'he')
   * @returns The appropriate label for the current locale
   */
  getDisplayLabel(tag: Tag, locale: string): string {
    return locale === 'he' ? tag.labelHe : tag.labelEn
  }
}

// Export individual functions for convenience
export const getAllTags = tagsService.getAll
export const getTagsByCategory = tagsService.getByCategory
export const getTagById = tagsService.getById
export const getTagDisplayLabel = tagsService.getDisplayLabel
