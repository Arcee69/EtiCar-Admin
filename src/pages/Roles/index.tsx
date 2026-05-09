import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi2'
import AddRoles from './components/AddRoles'
import DeleteRoles from './components/DeleteRoles'
import EditRoles from './components/EditRoles'
import { rolesAndPermissionsApi } from '../../services/rolesAndPermissions'
import type { Role, RoleData, RolePayload, Permission, PermissionData } from './types'
import { toast } from 'sonner'

const mapApiRoleToUiRole = (apiRole: RoleData): Role => ({
  id: apiRole.id,
  name: apiRole.name,
  display_name: apiRole.display_name,
  description: apiRole.description,
  users: apiRole.users_count,
  permissions: apiRole.permissions,
  iconBgClass: apiRole.badge_color,
})

// Flatten all Permission objects from all categories into a single array
const flattenPermissions = (permissionsData: PermissionData): Permission[] => {
  return Object.values(permissionsData).flat()
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissionsList, setPermissionsList] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await rolesAndPermissionsApi.getRoles()
        const mappedRoles = (data as RoleData[]).map(mapApiRoleToUiRole)
        setRoles(mappedRoles)
      } catch (err) {
        setError('Failed to load roles. Please try again.')
        console.error('Error fetching roles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await rolesAndPermissionsApi.getPermissions()
        const flatPermissions = flattenPermissions(data as PermissionData)
        setPermissionsList(flatPermissions)
      } catch (err) {
        console.error('Error fetching permissions:', err)
      }
    }

    fetchPermissions()
  }, [])

  const handleAddRole = async (payload: RolePayload) => {
    try {
      const newRole = await rolesAndPermissionsApi.createRole(payload)
      const mappedRole = mapApiRoleToUiRole(newRole)
      toast.success('Role created successfully')
      setRoles((prev) => [...prev, mappedRole])
      setIsAddOpen(false)
    } catch (err) {
      console.error('Error creating role:', err)
      setError('Failed to create role. Please try again.')
      toast.error('Failed to create role. Please try again.')
    }
  }

  const handleEditRole = async (roleId: string, payload: RolePayload) => {
    try {
      await rolesAndPermissionsApi.updateRoles(roleId, payload)
      setRoles((prev) =>
        prev.map((role) =>
          role.id === roleId
            ? { ...role, name: payload.name, display_name: payload.name, description: payload.description, iconBgClass: payload.badge_color, permissions: payload.permissions }
            : role
        )
      )
      toast.success('Role updated successfully')
      setIsEditOpen(false)
      setSelectedRole(null)
    } catch (err) {
      console.error('Error updating role:', err)
      setError('Failed to update role. Please try again.')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await rolesAndPermissionsApi.deleteRole(roleId)
      setRoles((prev) => prev.filter((role) => role.id !== roleId))
      toast.success('Role deleted successfully')
      setIsDeleteOpen(false)
      setSelectedRole(null)
    } catch (err) {
      console.error('Error deleting role:', err)
      toast.error('Failed to delete role. Please try again.')
      setError('Failed to delete role. Please try again.')
    }
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

  // ─── Skeleton Loader ─────────────────────────────────────────────────────

  const SkeletonRoleCard = () => (
    <div className="bg-white border border-GREY-100 rounded-xl p-5 flex items-start justify-between gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-GREY-300 w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 bg-GREY-200/50 rounded" />
          <div className="h-3 w-48 bg-GREY-200/50 rounded" />
          <div className="flex gap-1.5 mt-2">
            <div className="h-5 w-16 bg-GREY-200/50 rounded-md" />
            <div className="h-5 w-20 bg-GREY-200/50 rounded-md" />
            <div className="h-5 w-14 bg-GREY-200/50 rounded-md" />
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 space-y-2">
        <div className="h-4 w-16 bg-GREY-200/50 rounded ml-auto" />
        <div className="flex gap-1 mt-2 justify-end">
          <div className="w-6 h-6 bg-GREY-200/50 rounded" />
          <div className="w-6 h-6 bg-GREY-200/50 rounded" />
        </div>
      </div>
    </div>
  )

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

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-RED-100/10 border border-RED-200 text-RED-200">
          {error}
        </div>
      )}

      <div className="max-w-4xl space-y-4">
        {loading ? (
          <>
            <SkeletonRoleCard />
            <SkeletonRoleCard />
            <SkeletonRoleCard />
            <SkeletonRoleCard />
          </>
        ) : roles.length === 0 ? (
          <div className="text-center py-12 bg-white border border-GREY-100 rounded-xl">
            <p className="text-GREY-200">No roles found. Create your first role to get started.</p>
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className="bg-white border border-GREY-100 rounded-xl p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${role.iconBgClass}`}>
                  <HiOutlineShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-NEUTRAL-100">{role.display_name}</h3>
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
          ))
        )}
      </div>

      <AddRoles
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddRole}
        permissionOptions={permissionsList}
      />
      <EditRoles
        isOpen={isEditOpen}
        role={selectedRole}
        onClose={closeEdit}
        onSave={handleEditRole}
        permissionOptions={permissionsList}
      />
      <DeleteRoles isOpen={isDeleteOpen} role={selectedRole} onClose={closeDelete} onDelete={handleDeleteRole} />
    </div>
  )
}

export default Roles
