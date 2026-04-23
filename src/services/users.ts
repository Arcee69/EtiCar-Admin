import type { UsersData } from "../types/global"
import { GET_USERS } from "./api"
import apiInstance from "./instance"


export interface UsersFilters {
  search?: string
  status?: 'active' | 'pending' | 'suspended'
  per_page?: number
}

export interface UserResponse {
  data: UsersData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// API functions for users
export const usersApi = {
  // Get users with filters
  getUsers: async (filters: UsersFilters): Promise<UserResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')

    const response = await apiInstance.get(`${GET_USERS}?${params.toString()}`)
    return response.data
  },

  // Update user
    updateUser: async (id: string, data: Partial<UsersData>): Promise<UsersData> => {
        const response = await apiInstance.put(`${GET_USERS}/${id}`, data)
        return response.data.data
    },

  //Update user status
  updateUserStatus: async (id: string, status: 'activate' | 'deactivate'): Promise<UsersData> => {
    const response = await apiInstance.post(`${GET_USERS}/${id}/${status}`)
    return response.data.data
  },

  //Deactivate user
  deactivateUser: async (id: string): Promise<UsersData> => {
    const response = await apiInstance.delete(`${GET_USERS}/${id}`)
    return response.data.data
  },


    // Get single user by ID
    // getUserById: async (id: number): Promise<UsersData> => {
    //   const response = await apiInstance.get(`${GET_USERS}/${id}`)
    //   return response.data
    // },
}