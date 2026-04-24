import type { ProvidersData } from "../types/global"
import { GET_PROVIDERS } from "./api"
import apiInstance from "./instance"

export interface ProvidersFilters {
  search?: string
  status?: 'verified' | 'pending' | 'declined'
  per_page?: number
  page?: number
}

export interface ProvidersResponse {
  data: ProvidersData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

//API functions for providers
export const providersApi = {
  // Get providers with filters
  getProviders: async (filters: ProvidersFilters): Promise<ProvidersResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
    if (filters.page) params.append('page', filters.page.toString())

    const response = await apiInstance.get(`${GET_PROVIDERS}?${params.toString()}`)
    return response.data
  },

  // Get single provider by ID
  getProvider: async (id: string): Promise<ProvidersData> => {
    const response = await apiInstance.get(`${GET_PROVIDERS}/${id}`)
    return response.data.data
  },

  // Update provider
  updateProvider: async (id: string, data: Partial<ProvidersData>): Promise<ProvidersData> => {
    const response = await apiInstance.put(`${GET_PROVIDERS}/${id}`, data)
    return response.data.data
  },

  //Verify provider
  verifyProvider: async (id: string, data: Partial<ProvidersData>): Promise<ProvidersData> => {
    const response = await apiInstance.post(`${GET_PROVIDERS}/${id}/verify`, data)
    return response.data.data
  },

  //Deactivate provider
  deactivateProvider: async (id: string): Promise<ProvidersData> => { //, data: string
    const response = await apiInstance.delete(`${GET_PROVIDERS}/${id}`) //, { reason: data }
    return response.data.data
  },
}