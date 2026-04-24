import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineXMark } from "react-icons/hi2"
import { toast } from "sonner"
import type { ProvidersData } from "../../../types/global"

interface DeactivateProviderProps {
  handleClose: () => void
  selectedProvider: ProvidersData | null
  onConfirm: (reason: string) => void
}

const DeactivateProvider = ({ handleClose, selectedProvider, onConfirm }: DeactivateProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')

  if (!selectedProvider) return null

  const handleDeactivate = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for deactivation")
      return
    }

    setLoading(true)
    try {
      await onConfirm(reason)
      toast.success("Provider deactivated successfully")
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white max-w-md p-4 mt-20 h-90 shadow rounded-lg">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-NEUTRAL-100">Deactivate Provider</h2>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close deactivate modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5">
        {/* Confirmation Message */}
        <div className="bg-GREY-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-NEUTRAL-100">
            Are you sure you want to deactivate <span className="font-semibold">{selectedProvider.business_name}</span>?
            This action can be reversed later if needed.
          </p>
        </div>

        {/* Reason Input */}
        <div className="mb-4">
          <label htmlFor="deactivate-reason" className="block text-xs font-semibold text-GREY-200 mb-2">
            Reason for Deactivation <span className="text-red-500">*</span>
          </label>
          <textarea
            id="deactivate-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for deactivation..."
            rows={3}
            className="w-full rounded-lg border border-GREY-100 p-3 text-sm text-NEUTRAL-100 focus:outline-none focus:ring-2 focus:ring-BLUE-400 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="bg-white border border-GREY-100 text-NEUTRAL-100 rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center hover:bg-GREY-100 transition-colors disabled:opacity-50"
          >
            <span className="text-sm font-medium">Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleDeactivate}
            disabled={loading || !reason.trim()}
            className="bg-red-500 hover:bg-red-600 border-none text-white rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Deactivate'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeactivateProvider
