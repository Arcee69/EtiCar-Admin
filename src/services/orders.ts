import type { OrdersData } from "../types/global"
import { GET_ORDERS } from "./api"
import apiInstance from "./instance"

export interface OrdersFilters {
  search?: string
  status?: 'delivered' | 'pending' | 'shipped' | 'cancelled' | 'confirmed'
  per_page?: number
  page?: number
}

export interface OrdersResponse {
  data: OrdersData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// API functions for orders
export const ordersApi = {
  // Get orders with filters
  getOrders: async (filters: OrdersFilters): Promise<OrdersResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
    if (filters.page) params.append('page', filters.page.toString())

    const response = await apiInstance.get(`${GET_ORDERS}?${params.toString()}`)
    return response.data
  },

  // Get single order by ID
  getOrder: async (id: string): Promise<OrdersData> => {
    const response = await apiInstance.get(`${GET_ORDERS}/${id}`)
    return response.data.data
  },

  //Update Order
  updateOrder: async (id: string, data: Partial<OrdersData>): Promise<OrdersData> => {
    const response = await apiInstance.patch(`${GET_ORDERS}/${id}/status`, data)
    return response.data.data
  },

  //Cancel Order
  cancelOrder: async (id: string, data: string): Promise<OrdersData> => {
    const response = await apiInstance.post(`${GET_ORDERS}/${id}/cancel`, { reason: data })
    return response.data.data
  },
}