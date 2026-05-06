import { HiOutlineCheckCircle, HiOutlineXMark } from "react-icons/hi2"
import { useState } from "react"
import { toast } from "sonner"
import { CgSpinner } from "react-icons/cg"
import { vehiclesApi } from "../../../services/vehicles"
import type { VehiclesData } from "../../../types/global"

interface RestoreVehicleProps {
  handleClose: () => void
  vehicleDetails: VehiclesData | null
  onUpdate?: () => void
}

const RestoreVehicle = ({ handleClose, vehicleDetails, onUpdate }: RestoreVehicleProps) => {
  const [restoreLoading, setRestoreLoading] = useState(false)

  const handleRestore = async () => {
    if (!vehicleDetails) {
      return
    }

    setRestoreLoading(true)
    try {
      await vehiclesApi.restoreVehiclesItem(vehicleDetails.id)
      toast.success('Vehicle restored successfully')
      onUpdate?.()
      handleClose()
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || 'Failed to restore vehicle'
      toast.error(message)
    } finally {
      setRestoreLoading(false)
    }
  }

  if (!vehicleDetails) return null

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md rounded-xl border border-GREY-100 h-50 mt-20 bg-white p-5 shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-TEAL-100/15 p-2 text-TEAL-300">
            <HiOutlineCheckCircle className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Restore Vehicle</h2>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close restore vehicle modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm leading-6 text-GREY-200">
        This will restore
        <span className="mx-1 font-semibold text-NEUTRAL-100">
          {vehicleDetails.make} {vehicleDetails.model} ({vehicleDetails.plate_number})
        </span>
        and make it available again.
      </p>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={restoreLoading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleRestore}
          className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 flex items-center gap-2"
          disabled={restoreLoading}
        >
          {restoreLoading ? <CgSpinner className="animate-spin text-lg" /> : 'Restore Vehicle'}
        </button>
      </div>
    </div>
  )
}

export default RestoreVehicle