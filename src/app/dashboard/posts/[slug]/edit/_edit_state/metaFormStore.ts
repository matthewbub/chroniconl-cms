import { Category } from '@/utils/types'
import { create } from 'zustand'

export interface MetaFormState {
  categories: Category[]
  setCategories: (categories: Category[]) => void

  publishDate: Date
  setPublishDate: (publishDate: Date) => void

  createdAt: Date
  setCreatedAt: (createdAt: Date) => void

  visibility: string
  setVisibility: (visibility: string) => void

  description: string
  setDescription: (description: string) => void

  currentCategory: string
  setCurrentCategory: (currentCategory: string) => void

  imageUrl: string | null
  setImageUrl: (imageUrl: string | null) => void

  imageId: string | null
  setImageId: (imageId: string | null) => void
}

export const useMetaFormStore = create<MetaFormState>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),

  publishDate: new Date(),
  setPublishDate: (publishDate: Date) => set({ publishDate }),

  createdAt: new Date(),
  setCreatedAt: (createdAt: Date) => set({ createdAt }),

  visibility: '',
  setVisibility: (visibility: string) => set({ visibility }),

  description: '',
  setDescription: (description: string) => set({ description }),

  currentCategory: '',
  setCurrentCategory: (currentCategory: string) => set({ currentCategory }),

  imageUrl: '',
  setImageUrl: (imageUrl: string | null) => set({ imageUrl }),

  imageId: '',
  setImageId: (imageId: string | null) => set({ imageId }),
}))
