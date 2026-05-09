export interface Role {
  id: string
  name: string
  display_name: string
  description: string
  users: number
  permissions: string[]
  iconBgClass: string
}

// API data shape for a role (matches RolesData from global types, subset needed)
export interface RoleData {
  id: string
  name: string
  description: string
  badge_color: string
  display_name: string
  users_count: number
  permissions: string[]
  permissions_categories?: string[]
  is_system_role?: boolean
}

export interface RolePayload {
  name: string
  description: string
  badge_color: string
  permissions: string[]
}
export type EditRoleData = RolePayload

export interface Permission {
  id: number
  name: string
  display_name: string
}

export interface PermissionData {
  All: Permission[]
  Users: Permission[]
  Providers: Permission[]
  Vendors: Permission[]
  "Service Requests": Permission[]
  Orders: Permission[]
  Inventory: Permission[]
  Wallets: Permission[]
  Transactions: Permission[]
  Analytics: Permission[]
  Notifications: Permission[]
  Roles: Permission[]
  Other: Permission[]
}

export const roleColorOptions = [
  { label: 'Blue', value: 'blue' },
  { label: 'Teal', value: 'teal' },
  { label: 'Orange', value: 'orange' },
  { label: 'Navy', value: 'navy' },
]
