import { useEffect, useMemo, useState } from 'react'
import { HiOutlineXMark } from 'react-icons/hi2'
import { ModalPop } from '../../../components'
import { roleColorOptions, type Permission, type Role, type RolePayload } from '../types'

interface EditRolesProps {
  isOpen: boolean
  role: Role | null
  onClose: () => void
  onSave: (roleId: string, payload: RolePayload) => void
  permissionOptions: Permission[]
}

const EditRoles = ({ isOpen, role, onClose, onSave, permissionOptions }: EditRolesProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [iconBgClass, setIconBgClass] = useState(roleColorOptions[0].value)
  const [permissions, setPermissions] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [adminName, setAdminName] = useState("")

  const roleNames = [
    "Finance Manager",
    "Super Admin",
    "Operations Manager",
    "Vendor Manager"
  ]

  useEffect(() => {
    if (!role) {
      return
    }

    setName(role.name)
    setDescription(role.description)
    setIconBgClass(role.iconBgClass)
    setPermissions(role.permissions)
    // Note: email and adminName are not in Role type, setting empty defaults
    setEmail("")
    setAdminName("")
  }, [role])

  const canSubmit = useMemo(() => {
    return Boolean(role) && name.length > 0 && description.trim().length > 2 && permissions.length > 0
  }, [description, name, permissions.length, role])

  const togglePermission = (permissionName: string) => {
    setPermissions((prev) =>
      prev.includes(permissionName) ? prev.filter((item) => item !== permissionName) : [...prev, permissionName]
    )
  }

  const handleSave = () => {
    if (!role || !canSubmit) {
      return
    }

    onSave(role.id, {
      name: name.trim(),
      description: description.trim(),
      badge_color: iconBgClass,
      permissions,
    })
    onClose()
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 mt-10 bg-white p-5 md:p-6 max-h-[55vh] shadow-xl"
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
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20 bg-white"
            >
              {roleNames.map((roleName) => (
                <option key={roleName} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Admin Name</span>
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
            <span className="text-sm font-medium text-NEUTRAL-100">Badge Color</span>
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
          <p className="mb-2 text-sm font-medium text-NEUTRAL-100">Permissions</p>
          <div className="flex flex-wrap gap-2">
            {permissionOptions.map((permission) => {
              const active = permissions.includes(permission.name)
              return (
                <button
                  key={permission.name}
                  type="button"
                  onClick={() => togglePermission(permission.name)}
                  className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
                    active
                      ? 'border-BLUE-400 bg-BLUE-400/10 text-BLUE-100'
                      : 'border-GREY-100 bg-white text-NEUTRAL-100 hover:bg-GREY-300'
                  }`}
                >
                  {permission.display_name}
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
