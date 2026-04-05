import { useMemo, useState } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import { ModalPop } from '../../../components'
import { permissionOptions, roleColorOptions, type RolePayload } from '../types'

interface AddRolesProps {
  isOpen: boolean
  onClose: () => void
  onSave: (payload: RolePayload) => void
}

const AddRoles = ({ isOpen, onClose, onSave }: AddRolesProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [users, setUsers] = useState(0)
  const [iconBgClass, setIconBgClass] = useState(roleColorOptions[0].value)
  const [permissions, setPermissions] = useState<string[]>([])

  const canSubmit = useMemo(() => {
    return name.trim().length > 1 && description.trim().length > 2 && permissions.length > 0
  }, [description, name, permissions.length])

  const resetForm = () => {
    setName('')
    setDescription('')
    setUsers(0)
    setIconBgClass(roleColorOptions[0].value)
    setPermissions([])
  }

  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((item) => item !== permission) : [...prev, permission]
    )
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = () => {
    if (!canSubmit) {
      return
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      users,
      permissions,
      iconBgClass,
    })
    handleClose()
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 bg-white p-5 md:p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Add Role</h2>
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
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Compliance Manager"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Users Assigned</span>
            <input
              type="number"
              min={0}
              value={users}
              onChange={(e) => setUsers(Number(e.target.value || 0))}
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

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-NEUTRAL-100">Badge Color</p>
          <div className="flex flex-wrap gap-2">
            {roleColorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setIconBgClass(option.value)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  iconBgClass === option.value
                    ? 'border-BLUE-400 bg-BLUE-400/10 text-BLUE-100'
                    : 'border-GREY-100 text-NEUTRAL-100 hover:bg-GREY-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-NEUTRAL-100">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {permissionOptions.map((permission) => {
              const active = permissions.includes(permission)
              return (
                <button
                  key={permission}
                  type="button"
                  onClick={() => togglePermission(permission)}
                  className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
                    active
                      ? 'border-BLUE-400 bg-BLUE-400/10 text-BLUE-100'
                      : 'border-GREY-100 bg-white text-NEUTRAL-100 hover:bg-GREY-300'
                  }`}
                >
                  {permission}
                </button>
              )
            })}
          </div>
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
            onClick={handleSave}
            disabled={!canSubmit}
            className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Role
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default AddRoles
