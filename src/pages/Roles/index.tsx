import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlineShieldCheck } from 'react-icons/hi2'
import AddAdmin from './components/AddAdmin'
import { rolesAndPermissionsApi } from '../../services/rolesAndPermissions'
import type { Role, RoleData, } from '../../types/global'
import { useNavigate } from 'react-router-dom'


const mapApiRoleToUiRole = (apiRole: RoleData): Role => ({
  id: apiRole.id,
  name: apiRole.name,
  display_name: apiRole.display_name,
  description: apiRole.description,
  admins_count: apiRole.admins_count,
  badge_color: apiRole.badge_color,
})


const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)


  const navigate = useNavigate()

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await rolesAndPermissionsApi.getAdmins()
      const mappedRoles = (data as RoleData[]).map(mapApiRoleToUiRole)
      setRoles(mappedRoles)
    } catch (err) {
      setError('Failed to load roles. Please try again.')
      console.error('Error fetching roles:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchRoles()
  }, [])


  const handleAdminAdded = () => {
    setIsAddOpen(false)
    fetchRoles()
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
          Add Admin
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
              className="bg-white border border-GREY-100 rounded-xl p-5 cursor-pointer flex items-start justify-between gap-4"
              onClick={() => navigate(`/admin/roles/${role.name}`, { state: { role } })}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg`}>
                  <HiOutlineShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-NEUTRAL-100">{role.display_name}</h3>
                  <p className="text-sm text-GREY-200 mt-0.5">{role.description}</p>

                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-NEUTRAL-100">{role.admins_count} users</p>

              </div>
            </div>
          ))
        )}
      </div>

      <AddAdmin
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleAdminAdded}
      />
    </div>
  )
}

export default Roles
