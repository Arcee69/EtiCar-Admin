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

// Inventory and Vendor related types
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

export interface InventoryItem {
  id: string
  sku: string
  productName: string
  category: string
  vendorId: string
  vendorName: string
  unitPrice: number
  quantity: number
}

export interface InventoryPayload {
  sku: string
  productName: string
  category: string
  vendorId: string
  unitPrice: number
  quantity: number

}

export interface DeleteInventoryProps {
  isOpen: boolean
  item: InventoryItem | null
  onClose: () => void
  onDelete: (itemId: string) => void
}

//Provider related types
export interface Provider {
  id: string
  name: string
  phone: string
  services: string[]
  city: string
  activeJobs: number
  completed: number
  wallet: string
  email: string
  registrationDate: string
  businessType: string
  status: 'Pending' | 'Verified' | 'Declined'
  documents: {
    idCard: string
    businessRegistration: string
    addressProof: string
  }
}


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