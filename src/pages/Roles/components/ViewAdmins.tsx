import { useState, useEffect, useCallback } from 'react'
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import { CgSpinner } from 'react-icons/cg'
import { toast } from 'sonner'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ReassignAdmin from './ReassignAdmin'
import RemoveAdminFromRole from './RemoveAdminFromRole'
import SuspendAdmin from './SuspendAdmin'
import { Table } from '../../../components'
import type { AdminInfo, Role } from '../../../types/global'
import { rolesAndPermissionsApi } from '../../../services/rolesAndPermissions'
import { MdOutlinePauseCircleOutline } from 'react-icons/md'

interface LocationState {
  role?: Role
}

const ViewAdmins = () => {
  const { roleName } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState }

  const [isReassignAdminOpen, setIsReassignAdminOpen] = useState(false)
  const [isRemoveAdminOpen, setIsRemoveAdminOpen] = useState(false)
  const [isSuspendAdminOpen, setIsSuspendAdminOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminInfo | null>(null)
  const [selectedRole, _] = useState<Role | null>(state?.role || null)
  const [admins, setAdmins] = useState<AdminInfo[]>([])
  const [loading, setLoading] = useState(false)

  const roleId = state?.role?.id || roleName

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true)
      const data = await rolesAndPermissionsApi.getRoleDetails(roleName || '')
      setAdmins(data.users ?? [])
    } catch (error) {
      const message = (error as any)?.response?.data?.message || 'Failed to load admins. Please try again.'
      toast.error(message)
      setAdmins([])
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const openReassignAdmin = useCallback((admin: AdminInfo) => {
    setSelectedAdmin(admin)
    setIsReassignAdminOpen(true)
  }, [])

  const openRemoveAdmin = useCallback((admin: AdminInfo) => {
    setSelectedAdmin(admin)
    setIsRemoveAdminOpen(true)
  }, [])

  const openSuspendAdmin = useCallback((admin: AdminInfo) => {
    setSelectedAdmin(admin)
    setIsSuspendAdminOpen(true)
  }, [])

  const closeReassignAdmin = () => {
    setIsReassignAdminOpen(false)
    setSelectedAdmin(null)
  }

  const closeRemoveAdmin = () => {
    setIsRemoveAdminOpen(false)
    setSelectedAdmin(null)
  }

  const closeSuspendAdmin = () => {
    setIsSuspendAdminOpen(false)
    setSelectedAdmin(null)
  }

  const adminsChanged = () => {
    fetchAdmins()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'suspended':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-GREY-100 text-GREY-200'
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Admin Name',
      render: (_: AdminInfo) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-NEUTRAL-100">{_.full_name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (_: AdminInfo) => (
        <span className="text-GREY-200">{_.email}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_: AdminInfo) => (
        <span className={`px-2.5 py-1 rounded-full capitalize text-xs font-medium ${getStatusColor(_.status)}`}>
          {_.status}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date Added',
      render: (_: AdminInfo) => (
        <span className="text-GREY-200">{_.created_at}</span>
      ),
    },
  ]

  return (
    <div className="font-sans">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm font-medium text-GREY-200 hover:text-NEUTRAL-100 transition-colors cursor-pointer"
        >
          <span>&larr;</span> Back
        </button>
        <div />
      </div>

      <h1 className="text-2xl font-semibold text-NEUTRAL-100 mb-5">
        {`${selectedRole?.display_name}s` || 'Admins'}
      </h1>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <CgSpinner className="animate-spin text-2xl text-BLUE-100" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={admins}
            emptyMessage="No admins assigned to this role yet."
            renderActions={(admin) => (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openReassignAdmin(admin)}
                  className="p-1.5 rounded-md hover:bg-GREY-300 transition-colors cursor-pointer"
                  aria-label={`Reassign ${admin.full_name}`}
                  title="Reassign"
                >
                  <HiOutlinePencilSquare className="w-3.5 h-3.5 text-GREY-200" />
                </button>
                <button
                  type="button"
                  onClick={() => openSuspendAdmin(admin)}
                  className="p-1.5 rounded-md hover:bg-GREY-300 transition-colors cursor-pointer"
                  aria-label={`Suspend ${admin.full_name}`}
                  title="Suspend"
                >
                  <MdOutlinePauseCircleOutline className="w-3.5 h-3.5 text-GREY-200" />
                </button>
                <button
                  type="button"
                  onClick={() => openRemoveAdmin(admin)}
                  className="p-1.5 rounded-md hover:bg-GREY-300 transition-colors cursor-pointer"
                  aria-label={`Remove ${admin.full_name}`}
                  title="Remove from role"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5 text-GREY-200" />
                </button>
              </div>
            )}
          />
        )}
      </div>

      <ReassignAdmin
        isOpen={isReassignAdminOpen}
        onClose={closeReassignAdmin}
        selectedRole={selectedRole}
        selectedAdmin={selectedAdmin}
        onSuccess={adminsChanged}
      />

      <RemoveAdminFromRole
        isOpen={isRemoveAdminOpen}
        role={selectedRole}
        admin={selectedAdmin}
        onClose={closeRemoveAdmin}
        onSuccess={adminsChanged}
      />

      <SuspendAdmin
        isOpen={isSuspendAdminOpen}
        onClose={closeSuspendAdmin}
        adminId={selectedAdmin?.uuid}
        adminName={selectedAdmin?.full_name}
        onSuccess={adminsChanged}
      />
    </div>
  )
}

export default ViewAdmins
