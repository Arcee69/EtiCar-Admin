import type { Transaction } from "../types/global"
import { GET_TRANSACTIONS } from "./api"
import apiInstance from "./instance"


export interface TransactionFilters {
  search?: string
  status?: 'pending' | 'successful' | 'failed'
  type?: 'credit' | 'debit'
  per_page?: number
  page?: number
}

export interface TransactionResponse {
  data: Transaction[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}


// API functions for transactions
export const transactionsApi = {
  // Get transactions with filters
  getTransactions: async (filters: TransactionFilters = {}): Promise<TransactionResponse> => {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.per_page) params.append('per_page', filters.per_page?.toString() || '10')

    const response = await apiInstance.get(`${GET_TRANSACTIONS}?${params.toString()}`)
    return response.data
  },

  // Get single transaction by ID
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await apiInstance.get(`${GET_TRANSACTIONS}/${id}`)
    return response.data.data
  },


}