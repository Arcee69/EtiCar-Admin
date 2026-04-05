import { useEffect, useMemo, useState } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import { ModalPop } from '../../../components'
import { permissionOptions, roleColorOptions, type Role, type RolePayload } from '../types'

interface EditRolesProps {
  isOpen: boolean
  role: Role | null
  onClose: () => void
  onSave: (roleId: string, payload: RolePayload) => void
}

const EditRoles = ({ isOpen, role, onClose, onSave }: EditRolesProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [users, setUsers] = useState(0)
  const [iconBgClass, setIconBgClass] = useState(roleColorOptions[0].value)
  const [permissions, setPermissions] = useState<string[]>([])

  useEffect(() => {
    if (!role) {
      return
    }

    setName(role.name)
    setDescription(role.description)
    setUsers(role.users)
    setIconBgClass(role.iconBgClass)
    setPermissions(role.permissions)
  }, [role])

  const canSubmit = useMemo(() => {
    return Boolean(role) && name.trim().length > 1 && description.trim().length > 2 && permissions.length > 0
  }, [description, name, permissions.length, role])

  const togglePermission = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((item) => item !== permission) : [...prev, permission]
    )
  }

  const handleSave = () => {
    if (!role || !canSubmit) {
      return
    }

    onSave(role.id, {
      name: name.trim(),
      description: description.trim(),
      users,
      permissions,
      iconBgClass,
    })
    onClose()
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 bg-white p-5 md:p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Edit Role</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close edit role modal"
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
            onClick={onClose}
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
            Save Changes
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default EditRoles
