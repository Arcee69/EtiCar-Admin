import { useState } from 'react'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi2'
import AddRoles from './components/AddRoles'
import DeleteRoles from './components/DeleteRoles'
import EditRoles from './components/EditRoles'
import type { Role, RolePayload } from './types'

const initialRoles: Role[] = [
  {
    id: 'R001',
    name: 'Super Admin',
    description: 'Full access to all modules',
    users: 2,
    permissions: ['all'],
    iconBgClass: 'bg-BLUE-100/10 text-BLUE-100',
  },
  {
    id: 'R002',
    name: 'Operations Manager',
    description: 'Manage service requests, providers, and users',
    users: 3,
    permissions: ['users', 'providers', 'service-requests', 'vehicles'],
    iconBgClass: 'bg-TEAL-100/10 text-TEAL-100',
  },
  {
    id: 'R003',
    name: 'Finance Manager',
    description: 'Wallets, payments, and revenue reports',
    users: 2,
    permissions: ['wallets', 'revenue', 'orders'],
    iconBgClass: 'bg-ORANGE-100/10 text-ORANGE-100',
  },
  {
    id: 'R004',
    name: 'Vendor Manager',
    description: 'Manage vendors and marketplace orders',
    users: 1,
    permissions: ['vendors', 'orders'],
    iconBgClass: 'bg-NAVY-100/10 text-NAVY-100',
  },
]

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleAddRole = (payload: RolePayload) => {
    setRoles((prev) => [
      ...prev,
      {
        id: `R${String(prev.length + 1).padStart(3, '0')}`,
        ...payload,
      },
    ])
  }

  const handleEditRole = (roleId: string, payload: RolePayload) => {
    setRoles((prev) => prev.map((role) => (role.id === roleId ? { ...role, ...payload } : role)))
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId))
  }

  const openEdit = (role: Role) => {
    setSelectedRole(role)
    setIsEditOpen(true)
  }

  const openDelete = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
    setSelectedRole(null)
  }

  const closeDelete = () => {
    setIsDeleteOpen(false)
    setSelectedRole(null)
  }

  return (
    <div className="font-sans">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-NEUTRAL-100">Admin Roles & Access</h1>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-BLUE-100 px-4 py-2.5 text-sm font-medium text-white hover:bg-BLUE-300"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="max-w-4xl space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-GREY-100 rounded-xl p-5 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg ${role.iconBgClass}`}>
                <HiOutlineShieldCheck className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-NEUTRAL-100">{role.name}</h3>
                <p className="text-sm text-GREY-200 mt-0.5">{role.description}</p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-GREY-300 text-xs text-NEUTRAL-100 capitalize"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-NEUTRAL-100">{role.users} users</p>

              <div className="flex gap-1 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => openEdit(role)}
                  className="p-1.5 rounded-md hover:bg-GREY-300 transition-colors"
                  aria-label={`Edit ${role.name}`}
                >
                  <HiOutlinePencilSquare className="w-3.5 h-3.5 text-GREY-200" />
                </button>

                <button
                  type="button"
                  onClick={() => openDelete(role)}
                  className="p-1.5 rounded-md hover:bg-GREY-300 transition-colors"
                  aria-label={`Delete ${role.name}`}
                >
                  <HiOutlineTrash className="w-3.5 h-3.5 text-GREY-200" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddRoles isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAddRole} />
      <EditRoles isOpen={isEditOpen} role={selectedRole} onClose={closeEdit} onSave={handleEditRole} />
      <DeleteRoles isOpen={isDeleteOpen} role={selectedRole} onClose={closeDelete} onDelete={handleDeleteRole} />
    </div>
  )
}

export default Roles
