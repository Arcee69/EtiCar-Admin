// Auth related types
export interface AdminUser {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url: string | null
  selfie_url: string | null
  status: string
  role: string
  phone_verified: boolean
  has_pin: boolean
  created_at: string
}

export interface AuthState {
  token: string | null
  user: AdminUser | null
  role: string | null
  permissions: string[]
  isAuthenticated: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    user: AdminUser
    role: string
    permissions: string[]
  }
}

// Vendor related types
export interface VendorOption {
  id: string
  name: string
}

export interface locationOption {
  city: string
  state: string
}

export interface Vendor {
  id: string
  vendor_name: string
  business_name: string
  location: locationOption
  business_address: string
  products_count: number
  orders_fulfilled: number
  verification_status: 'pending' | 'verified' | 'declined'
  status: 'active' | 'pending' | 'suspended'
}





//Provider related types
// export interface Provider {
//   id: string
//   name: string
//   phone: string
//   services: string[]
//   city: string
//   activeJobs: number
//   completed: number
//   wallet: string
//   email: string
//   registrationDate: string
//   businessType: string
//   status: 'Pending' | 'Verified' | 'Declined'
//   documents: {
//     idCard: string
//     businessRegistration: string
//     addressProof: string
//   }
// }


// Transaction related types
export interface Transaction {
  id: string
  wallet_id: string
  user: {
    id: string
    name: string
    email: string
    phone: string
  }
  type: 'credit' | 'debit'
  status: 'pending' | 'successful' | 'failed'
  amount: number
  fee: number
  balance_before: number
  balance_after: number
  currency: string
  provider_ref: string | null
  provider_name: string | null
  description: string
  metadata: any | null
  created_at: string
  updated_at: string
}

//Wallet related types
export interface WalletData {
  id: string
  user_id: string
  user: {
    name: string
    email: string
    phone: string
    type: string
    type_label: string
    is_deleted: boolean
    provider_verification: string
  }
  type: string
  type_label: string
  type_color: string
  balance: string
  balance_formatted: string
  ledger_balance: string
  ledger_balance_formatted: string
  currency: string
  is_frozen: boolean
  last_transaction: string
  last_transaction_at: string
  transactions_count: string
  created_at: string
  created_at_formatted: string
}
export interface WalletStats {
  total_balance: number
  total_balance_formatted: string
  total_credits: number
  total_credits_formatted: string
  total_debits: number
  total_debits_formatted: string
  total_wallets: number
  active_wallets: number
  frozen_wallets: number
}

// User related types
export interface UsersData {
  id: string
  name: string
  phone: string
  email: string
  registered_at: string
  registered_at_human: string
  vehicles_count: string
  status: string
  avatar_url: string | null
  can_deactivate: boolean
  can_activate: boolean
  email_verified: boolean
  phone_verified: boolean
  updated_at: string
}

//Orders related types
export interface OrdersData {
  id: string
  order_number: string
  order_number_short: string
  driver: string
  driver_phone: string
  vendor: string
  vendor_id: string
  product: string
  product_summary: string
  quantity: number
  total_amount: string
  total_amount_formatted: string
  status: string
  status_label: string
  status_color: string
  subtotal: string
  delivery_fee: string
  discount_amount: string
  currency: string
  notes: string | null
  items: {
    product_name: string
    quantity: string
    unit_price: string
    total_price: string
  }[]
  delivery_address: string | null
  created_at: string
  created_at_human: string
  confirmed_at: string | null
  delivered_at: string | null
  can_update_status: boolean
  can_cancel: boolean
  allowed_status_transitions: string[]
} 

//Provider related types
export interface ProvidersData {
  id: string
  business_name: string
  business_address?: string
  cac_number?: string
  service_area_id?: number
  latitude?: number
  longitude?: number
  phone: string
  services: string[]
  service_types: string[]
  city: string
  active_jobs: string
  completed_jobs: string
  wallet_balance: number
  wallet_balance_formatted: string
  verification_status: string
  verification_status_label: string
  verification_status_color: string
  rating: number
  total_reviews: string
  is_open: boolean
  is_online: boolean
  can_verify: boolean
  can_decline: boolean
  can_deactivate: boolean
  can_activate: boolean
  operating_hours?: {
    monday?: { open: string | null; close: string | null }
    tuesday?: { open: string | null; close: string | null }
    wednesday?: { open: string | null; close: string | null }
    thursday?: { open: string | null; close: string | null }
    friday?: { open: string | null; close: string | null }
    saturday?: { open: string | null; close: string | null }
    sunday?: { open: string | null; close: string | null }
  }
  created_at: string
  updated_at: string
}

// Service Requests related types
export interface ServiceRequestData {
  id: string
  request_id_short: string
  driver: string
  driver_phone: string
  vehicle: string
  service_type: string
  provider: string
  provider_id: string | null
  status: string
  status_label: string
  status_color: string
  quoted_price: string
  quoted_price_formatted: string
  scheduled_at: string
  scheduled_at_human: string
  created_at: string
  created_at_human: string
  notes: string | null
  cancellation_reason: string | null
  can_assign_provider: boolean
  can_cancel: boolean
  address: string | null
}

// Inventory related types
export interface InventoryData {
  id: string
  sku: string
  name: string
  description: string | null
  category: {
    id: string
    name: string
  }
  vendor: {
    id: string
    name: string
    is_deleted: boolean
  }
  price: string
  price_formatted: string
  stock_quantity: string
  stock_status: 'healthy' | 'low_stock' | 'out_of_stock'
  stock_status_label: string
  stock_status_color: string
  currency: string
  is_available: boolean
  is_deleted: boolean
  image_url?: string
  created_at: string
  created_at_formatted: string
  updated_at: string
}

// UI-specific Inventory Item (transformed from InventoryData for table display)
export interface InventoryItem {
  id: string
  sku: string
  productName: string
  is_deleted: boolean
  category: string
  categoryId: string
  vendorId: string
  vendorName: string
  unitPrice: number
  quantity: number
  stockStatus?: 'healthy' | 'low_stock' | 'out_of_stock' | 'medium'
}

// Inventory Stats
export interface InventoryStatsData {
  total_products: number
  active_products: number
  total_stock: number
  inventory_value: number
  inventory_value_formatted: string
  stock_breakdown: {
    healthy: number
    medium: number
    low: number
    out_of_stock: number
  }
}

// Reference Data for Inventory
export interface InventoryReferenceData {
  vendors: {
    id: string
    name: string
  }[]
  categories: {
    id: string
    name: string
  }[]
}

// Inventory Payload for creating/updating inventory items
export interface InventoryPayload {
  sku: string
  name: string
  category_id: string
  provider_id: string
  price: string
  stock_quantity: string
  description?: string
  image_url?: string
  currency?: string
  is_available?: boolean
}

//Delete Inventory Item Payload
export interface DeleteInventoryProps {
  isOpen: boolean
  item: InventoryData | null
  onClose: () => void
  onDelete: (itemId: string) => void
  deleteLoading: boolean
}

// Analytics related types
export interface AnalyticsData {
  summary: {
    commission: {
      value: number
      formatted: string
      trend_percent: number
      trend_direction: 'up' | 'down' | 'stable'
    }
    service_revenue: {
      value: number
      formatted: string
      trend_percent: number
      trend_direction: 'up' | 'down' | 'stable' | null
    }
    parts_revenue: {
      value: number
      formatted: string
      trend_percent: number
      trend_direction: 'up' | 'down' | 'stable' | null
    }
    total_revenue: {
      value: number
      formatted: string
    }
  }
  monthly_breakdown: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      color: string
    }[]
  }
  revenue_by_city: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  top_products: {
    name: string
    sku: string
    quantity_sold: number
    revenue: number
    revenue_formatted: string
  }[]
  top_services: {
    name: string
    completed_count: number
    revenue: number
    revenue_formatted: string
  }[]
}
