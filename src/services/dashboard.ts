import type { DashboardData } from "../types/global"
import { GET_DASHBOARD } from "./api"
import apiInstance from "./instance"


// API functions for dashboard
export const dashboardApi = {
    // Get dashboard data
    getDashboardData: async (): Promise<DashboardData> => {
        const response = await apiInstance.get(`${GET_DASHBOARD}`)
        return response.data.data
    },
}