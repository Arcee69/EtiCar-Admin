import type { AnalyticsData } from "../types/global"
import { GET_ANALYTICS } from "./api"
import apiInstance from "./instance"

export interface AnalyticsFilters {
  period?: string
}

// API functions for analytics
export const analyticsApi = {
    // Get analytics with filters
    getAnalytics: async (filters: AnalyticsFilters = {}): Promise<AnalyticsData> => {
        const params = new URLSearchParams()

        if (filters.period) params.append('period', filters.period)

        const response = await apiInstance.get(`${GET_ANALYTICS}?${params.toString()}`)
        return response.data.data
    },
}