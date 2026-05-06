import type { VehiclesData, VehiclesPayload, VehiclesReferenceData, VehiclesStatsData } from "../types/global"
import { GET_VEHICLES, GET_VEHICLES_REFERENCE_DATA, GET_VEHICLES_STATS } from "./api"
import apiInstance from "./instance"

export interface VehiclesFilters {
    search?: string
    per_page?: number
    page?: number
}

export interface VehiclesResponse {
  data: VehiclesData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// API functions for analytics
export const vehiclesApi = {
    // Get vehicles with filters
    getVehicles: async (filters: VehiclesFilters = {}): Promise<VehiclesResponse> => {
        const params = new URLSearchParams()

        if (filters.search) params.append('make', filters.search)
        if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')
        if (filters.page) params.append('page', filters.page.toString())

        const response = await apiInstance.get(`${GET_VEHICLES}?${params.toString()}`)
        return response.data
    },

    // Get vehicles stats
    getVehiclesStats: async (): Promise<VehiclesStatsData> => {
        const response = await apiInstance.get(GET_VEHICLES_STATS)
        return response.data.data
    },

     //Create Vehicles Item
    createVehicleItem: async (data: VehiclesPayload): Promise<VehiclesData> => {
        const response = await apiInstance.post(`${GET_VEHICLES}`, data)
        return response.data.data
    },

    // Update Vehicle
    updateVehicle: async (id: string, data: Partial<VehiclesData>): Promise<VehiclesData> => {
        const response = await apiInstance.put(`${GET_VEHICLES}/${id}`, data)
        return response.data.data
    },

    //Restore Vehicles
    restoreVehiclesItem: async (id: string): Promise<void> => {
        const response = await apiInstance.post(`${GET_VEHICLES}/${id}/restore`)
        return response.data.data
    },

    //Delete Vehicles Item
    deleteVehiclesItem: async (id: string): Promise<void> => {
        await apiInstance.delete(`${GET_VEHICLES}/${id}`)
    },

    // Get reference data (vehicle and categories)
    getReferenceData: async (): Promise<VehiclesReferenceData> => {
        const response = await apiInstance.get(GET_VEHICLES_REFERENCE_DATA)
        return response.data.data
    },
}