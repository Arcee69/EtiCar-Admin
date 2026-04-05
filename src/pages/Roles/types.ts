export interface Role {
  id: string
  name: string
  description: string
  users: number
  permissions: string[]
  iconBgClass: string
}

export interface RolePayload {
  name: string
  description: string
  users: number
  permissions: string[]
  iconBgClass: string
}

export const roleColorOptions = [
  { label: 'Blue', value: 'bg-BLUE-100/10 text-BLUE-100' },
  { label: 'Teal', value: 'bg-TEAL-100/10 text-TEAL-100' },
  { label: 'Orange', value: 'bg-ORANGE-100/10 text-ORANGE-100' },
  { label: 'Navy', value: 'bg-NAVY-100/10 text-NAVY-100' },
]

export const permissionOptions = [
  'all',
  'users',
  'providers',
  'service-requests',
  'vehicles',
  'wallets',
  'revenue',
  'orders',
  'vendors',
]
