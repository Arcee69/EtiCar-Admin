import type { WalletData, WalletStats } from "../types/global"
import { GET_WALLET } from "./api"
import apiInstance from "./instance"


export interface WalletResponse {
  data: WalletData[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface WalletFilters {
  search?: string
//   status?: 'active' | 'pending' | 'suspended'
//   per_page?: number
}

// API functions for wallets
export const walletApi = {
    // Get wallets with filters
  getWallets: async (filters: WalletFilters): Promise<WalletResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    // if (filters.status) params.append('status', filters.status)
    // if (filters.type) params.append('type', filters.type)
    // if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')

    const response = await apiInstance.get(`${GET_WALLET}?${params.toString()}`)
    return response.data
  },

  // Get single wallet by ID
  getWallet: async (id: string): Promise<WalletData> => {
    const response = await apiInstance.get(`${GET_WALLET}/${id}`)
    return response.data.data
  },


  // Update wallet status
  updateWalletStatus: async (id: string, status: 'freeze' | 'unfreeze', data: string): Promise<WalletData> => {
    const response = await apiInstance.post(`${GET_WALLET}/${id}/${status}`, { reason: data })
    return response.data.data
  },

  // Get wallet stats
  getWalletStats: async (): Promise<WalletStats> => {
    const response = await apiInstance.get(`${GET_WALLET}/stats`)
    return response.data.data
  },
}