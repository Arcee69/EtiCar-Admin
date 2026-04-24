import type { InventoryData, InventoryPayload, InventoryReferenceData, InventoryStatsData } from "../types/global"
import { GET_INVENTORY, GET_REFERENCE_DATA, GET_INVENTORY_STATS } from "./api"
import apiInstance from "./instance"

export interface InventoryFilters {
  search?: string
  stock_status?: 'healthy' | 'low_stock' | 'out_of_stock' | 'medium'
  per_page?: number
  page?: number
}

export interface InventoryResponse {
  data: InventoryData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface InventoryStatsResponse {
  data: InventoryStatsData
}

// API functions for inventory
export const inventoryApi = {
    // Get inventory with filters
  getInventory: async (filters: InventoryFilters): Promise<InventoryResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.stock_status) params.append('stock_status', filters.stock_status)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
    if (filters.page) params.append('page', filters.page.toString())

    const response = await apiInstance.get(`${GET_INVENTORY}?${params.toString()}`)
    return response.data
  },

  // Get inventory stats
  getInventoryStats: async (): Promise<InventoryStatsData> => {
    const response = await apiInstance.get(GET_INVENTORY_STATS)
    return response.data.data
  },

  // Get single inventory by ID
  getInventoryItem: async (id: string): Promise<InventoryData> => {
    const response = await apiInstance.get(`${GET_INVENTORY}/${id}`)
    return response.data.data
  },

  //Update Inventory
  updateInventory: async (id: string, data: Partial<InventoryPayload>): Promise<InventoryData> => {
    const response = await apiInstance.put(`${GET_INVENTORY}/${id}`, data)
    return response.data.data
  },

  //Create Inventory Item
  createInventoryItem: async (data: InventoryPayload): Promise<InventoryData> => {
    const response = await apiInstance.post(`${GET_INVENTORY}`, data)
    return response.data.data
  },

  //Delete Inventory Item
  deleteInventoryItem: async (id: string): Promise<void> => {
    await apiInstance.delete(`${GET_INVENTORY}/${id}`)
  },

  // Get reference data (vendors and categories)
  getReferenceData: async (): Promise<InventoryReferenceData> => {
    const response = await apiInstance.get(GET_REFERENCE_DATA)
    return response.data.data
  },
}