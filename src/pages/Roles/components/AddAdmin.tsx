import { useMemo, useState } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import { CgSpinner } from 'react-icons/cg'
import { toast } from 'sonner'
import { ModalPop, PasswordField } from '../../../components'
import { rolesAndPermissionsApi } from '../../../services/rolesAndPermissions'
import type { AdminPayload } from '../../../types/global'

interface AddAdminProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AddAdmin = ({ isOpen, onClose, onSuccess }: AddAdminProps) => {
  const [loading, setLoading] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState("")
  const [adminName, setAdminName] = useState("")
  const [password, setPassword] = useState("")

  const canSubmit = useMemo(() => {
    return roleName.length > 0 && description.trim().length > 2 && email.trim().length > 5 && adminName.trim().length > 2 && password.trim().length >= 6
  }, [description, roleName, email, adminName, password])

  const roleNames = [
    {label: 'Finance Manager', value: 'finance_manager'},
    {label: 'Operations Manager', value: 'operations_manager'},
    {label: 'Vendor Manager', value: 'vendor_manager'}
  ]

  const resetForm = () => {
    setRoleName('')
    setEmail('')
    setDescription('')
    setAdminName('')
    setPassword('')
  }


  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = async () => {
    if (!canSubmit || loading) {
      return
    }

    const payload: AdminPayload = {
      role: roleName,
      full_name: adminName,
      email,
      password,
      description,
    }

    try {
      setLoading(true)
      await rolesAndPermissionsApi.createAdmin(payload)
      toast.success('Admin added successfully.')
      onSuccess?.()
      handleClose()
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to add admin. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 mt-10 bg-white p-5 md:p-6 max-h-[55vh] shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Add Admin</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close add role modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Role Name</span>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20 bg-white"
            >
              <option value="" disabled>Select a role</option>
              {roleNames.map((roleName) => (
                <option key={roleName.value} value={roleName.value}>
                  {roleName.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Admin Full Name</span>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. John Doe"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. johndoe@example.com"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Password</span>
            <PasswordField 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. Password@1"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-NEUTRAL-100">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What this role can do"
            className="resize-none rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
          />
        </label>

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
            onClick={handleSave}
            disabled={!canSubmit || loading}
            className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <CgSpinner className="animate-spin text-lg inline-block" /> : 'Add Admin'}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default AddAdmin
