import type { ServiceRequestData } from "../types/global"
import { GET_SERVICE_REQUESTS} from "./api"
import apiInstance from "./instance"

export interface ServiceRequestsFilters {
  search?: string
  status?: 'completed' | 'pending' | 'cancelled' | 'in_progress' | 'accepted'
  per_page?: number
  page?: number
}

export interface ServiceRequestsResponse {
  data: ServiceRequestData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

//API functions for service requests
export const serviceRequestsApi = {
  // Get service requests with filters
  getServiceRequests: async (filters: ServiceRequestsFilters): Promise<ServiceRequestsResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
    if (filters.page) params.append('page', filters.page.toString())

    const response = await apiInstance.get(`${GET_SERVICE_REQUESTS}?${params.toString()}`)
    return response.data
  },

  // Get single service request by ID
  getServiceRequest: async (id: string): Promise<ServiceRequestData> => {
    const response = await apiInstance.get(`${GET_SERVICE_REQUESTS}/${id}`)
    return response.data.data
  },

  //Assign provider to service request
  assignProvider: async (id: string, provider_id: string): Promise<ServiceRequestData> => {
    const response = await apiInstance.put(`${GET_SERVICE_REQUESTS}/${id}/assign-provider`, { provider_id })
    return response.data.data
  },

  //Cancel service request
  cancelServiceRequest: async (id: string, reason: string): Promise<ServiceRequestData> => {
    const response = await apiInstance.post(`${GET_SERVICE_REQUESTS}/${id}/cancel`, { reason })
    return response.data.data
  },

}