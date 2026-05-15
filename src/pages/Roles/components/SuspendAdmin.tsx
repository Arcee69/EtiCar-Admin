import { useState, useCallback } from 'react'
import { HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2'
import { toast } from 'sonner'
import { ModalPop } from '../../../components'
import { rolesAndPermissionsApi } from '../../../services/rolesAndPermissions'

interface SuspendAdminProps {
  isOpen: boolean
  onClose: () => void
  adminId?: string
  adminName?: string
  onSuccess?: () => void
}

const SuspendAdmin = ({ isOpen, onClose, adminId, adminName, onSuccess }: SuspendAdminProps) => {
  const [loading, setLoading] = useState(false)

  const handleSuspend = useCallback(async () => {
    if (!adminId) {
      toast.error('Admin ID is required')
      return
    }

    try {
      setLoading(true)
      await rolesAndPermissionsApi.suspendAdmin(adminId)
      toast.success(`${adminName || 'Admin'} has been suspended successfully.`)
      onSuccess?.()
      onClose()
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || 'Failed to suspend admin. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [adminId, adminName, onClose, onSuccess])

  if (!isOpen) return null

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border h-50 border-GREY-100 mt-20 bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-RED-100/15 p-2 text-RED-300">
              <HiOutlineExclamationTriangle className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-NEUTRAL-100">Suspend Admin</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close suspend admin modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm leading-6 text-GREY-200">
          Are you sure you want to suspend{' '}
          <span className="mx-1 font-semibold text-NEUTRAL-100">{adminName || 'this admin'}</span>
          ? They will no longer be able to access the platform.
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
            onClick={handleSuspend}
            disabled={loading}
            className="rounded-lg bg-RED-300 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Suspending...' : 'Suspend Admin'}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default SuspendAdmin
