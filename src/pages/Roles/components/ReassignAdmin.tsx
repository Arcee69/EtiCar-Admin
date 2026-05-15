import { HiOutlineXMark } from 'react-icons/hi2'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { ModalPop } from '../../../components'
import { rolesAndPermissionsApi } from '../../../services/rolesAndPermissions'
import type { AdminInfo, Role } from '../../../types/global'
import { roleNames } from '../../../helper'

interface ReassignAdminProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  selectedRole?: Role | null
  selectedAdmin?: AdminInfo | null
}

const ReassignAdmin = ({
  isOpen,
  onClose,
  onSuccess,
  selectedRole,
  selectedAdmin,
}: ReassignAdminProps) => {
  const [loading, setLoading] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [selectedAdminId, setSelectedAdminId] = useState<string>('')

  const initialAdminId = selectedAdmin?.uuid

  useMemo(() => {
    if (isOpen) {
      if (selectedAdmin?.uuid) {
        setSelectedAdminId(selectedAdmin.uuid)
      }
    }
  }, [isOpen, selectedRole, selectedAdmin])

  const canSubmit = roleName.length > 0 && initialAdminId && !loading

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleName(e.target.value)
    setSelectedAdminId('')
  }

  const handleReassign = async () => {
    if (!canSubmit || loading) return

    try {
      setLoading(true)
      await rolesAndPermissionsApi.reassignAdminToRole(roleName, selectedAdminId)
      toast.success('Admin reassigned successfully.')
      onSuccess?.()
      onClose()
    } catch (error) {
      const message = (error as any)?.response?.data?.message || 'Failed to reassign admin. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedAdminId(initialAdminId || '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <ModalPop isOpen={isOpen} closeModal={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 mt-10 bg-white p-5 md:p-6 max-h-[30vh] shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Reassign Admin</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close reassign admin modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Select Role</span>
            <select
              value={roleName}
              onChange={handleRoleChange}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20 bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a role</option>
              {roleNames.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

         
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReassign}
            disabled={!canSubmit}
            className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Reassigning...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default ReassignAdmin
