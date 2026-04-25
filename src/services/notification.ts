import type { NotificationData, NotificationStats } from "../types/global"
import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_STATS } from "./api"
import apiInstance from "./instance"


export interface NotificationFilters {
  per_page?: number
  page?: number
}


export interface NotificationResponse {
  data: NotificationData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// API functions for notifications
export const notificationApi = {
    // Get notification data
    getNotifications: async (filters: NotificationFilters = {}): Promise<NotificationResponse> => {
        const params = new URLSearchParams()
        if (filters.per_page) params.append('per_page', filters.per_page.toString())
        if (filters.page) params.append('page', filters.page.toString())

        const response = await apiInstance.get(`${GET_NOTIFICATIONS}?${params.toString()}`)
        return response.data
    },

    // Get notification stats
    getNotificationStats: async (): Promise<NotificationStats> => {
        const response = await apiInstance.get(`${GET_NOTIFICATIONS_STATS}`)
        return response.data.data
    },

    // Mark notification as read
    markAsRead: async (id: string): Promise<void> => {
        await apiInstance.post(`${GET_NOTIFICATIONS}/${id}/read`)
    },

    // Mark all notifications as read
    markAllAsRead: async (): Promise<void> => {
        await apiInstance.post(`${GET_NOTIFICATIONS}/read-all`)
    },
}