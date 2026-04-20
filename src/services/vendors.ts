import type { Vendor } from '../types/global'
import apiInstance from './instance'



export interface VendorFilters {
  search?: string
  status?: 'active' | 'pending' | 'suspended'
  location?: string
  per_page?: number
  page?: number
}

export interface VendorResponse {
  data: Vendor[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// API functions for vendors
export const vendorApi = {
  // Get vendors with filters
  getVendors: async (filters: VendorFilters = {}): Promise<VendorResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.location) params.append('location', filters.location)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
    if (filters.page) params.append('page', filters.page.toString())

    const response = await apiInstance.get(`/admin/vendors?${params.toString()}`)
    return response.data
  },

  // Get single vendor by ID
  getVendor: async (id: string): Promise<Vendor> => {
    const response = await apiInstance.get(`/admin/vendors/${id}`)
    return response.data.data
  },

  // Update vendor
  updateVendor: async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
    const response = await apiInstance.put(`/admin/vendors/${id}`, data)
    return response.data.data
  },

  // Update vendor status
  updateVendorStatus: async (id: string, status: 'activate' | 'suspend'): Promise<Vendor> => {
    const response = await apiInstance.post(`/admin/vendors/${id}/${status}`)
    return response.data.data
  },

  // Delete vendor
  deleteVendor: async (id: string): Promise<void> => {
    await apiInstance.delete(`/admin/vendors/${id}`)
  },
}

