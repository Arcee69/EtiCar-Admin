import { useState, useCallback } from 'react'
import { HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2'
import { toast } from 'sonner'
import { ModalPop } from '../../../components'
import { rolesAndPermissionsApi } from '../../../services/rolesAndPermissions'
import type { AdminInfo, Role } from '../../../types/global'

interface RemoveAdminFromRoleProps {
  isOpen: boolean
  role: Role | null
  admin: AdminInfo | null
  onClose: () => void
  onSuccess?: () => void
}

const RemoveAdminFromRole = ({ isOpen, role, admin, onClose, onSuccess }: RemoveAdminFromRoleProps) => {
  const [loading, setLoading] = useState(false)

  const handleRemove = useCallback(async () => {
    if (!role || !admin) {
      toast.error('Role and admin information are required.')
      return
    }

    try {
      setLoading(true)
      await rolesAndPermissionsApi.removeAdminFromRole(role.name, admin.uuid)
      toast.success(`${admin.full_name} has been removed from ${role.display_name ?? role.name} successfully.`)
      onSuccess?.()
      onClose()
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to remove admin from role. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [admin, role, onClose, onSuccess])

  if (!isOpen) return null

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-GREY-100 mt-20 max-h-[25vh] bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-RED-100/15 p-2 text-RED-300">
              <HiOutlineExclamationTriangle className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-NEUTRAL-100">Remove Admin</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close remove admin modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm leading-6 text-GREY-200">
          This action will permanently remove
          <span className="mx-1 font-semibold text-NEUTRAL-100">{admin?.full_name ?? 'this admin'}</span>
          from the role and cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="rounded-lg bg-RED-300 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Removing...' : 'Remove Admin'}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default RemoveAdminFromRole
