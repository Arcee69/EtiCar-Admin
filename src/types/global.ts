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
export interface Vendor {
  id: string
  name: string
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