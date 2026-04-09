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