import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineXMark, HiOutlineCheckBadge } from "react-icons/hi2"
import { toast } from "sonner"
import type { ProvidersData } from "../../../types/global"

interface VerifyProviderProps {
  handleClose: () => void
  selectedProvider: ProvidersData | null
  onConfirm: (status: 'Verified' | 'Declined') => void
}

const VerifyProvider = ({ handleClose, selectedProvider, onConfirm }: VerifyProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  if (!selectedProvider) return null

  const status = (selectedProvider.verification_status || '').toLowerCase()

  const handleVerify = async () => {
    setLoading(true)
    try {
      await onConfirm('Verified')
      toast.success("Provider verified successfully")
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    setLoading(true)
    try {
      await onConfirm('Declined')
      toast.success("Provider declined successfully")
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl rounded-2xl border border-GREY-100 h-160 bg-white shadow-xl"
    >
      <div className="flex items-start justify-between border-b border-GREY-100 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Verify Provider</h2>
          <p className="mt-1 text-sm text-GREY-200">Review provider details before verification decision.</p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close verification modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-5">
        {/* Provider Summary */}
        <div className="flex flex-col gap-3 rounded-xl border border-GREY-100 bg-GREY-800/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-NEUTRAL-100">{selectedProvider.business_name}</p>
            <p className="text-sm text-GREY-200">Provider ID: {selectedProvider.id}</p>
          </div>
          <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
            status === 'pending' ? 'bg-amber-400/15 text-amber-400 border-amber-400/30' :
            status === 'verified' ? 'bg-green-400/15 text-green-400 border-green-400/30' :
            'bg-red-400/15 text-red-400 border-red-400/30'
          }`}>
            {selectedProvider.verification_status_label || selectedProvider.verification_status}
          </span>
        </div>

        {/* Quick Info Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-GREY-100 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Business</p>
            <div className="space-y-3 text-sm text-NEUTRAL-100">
              <div><span className="font-medium">Phone:</span> {selectedProvider.phone}</div>
              <div><span className="font-medium">City:</span> {selectedProvider.city}</div>
              <div><span className="font-medium">Services:</span>{' '}
                {selectedProvider.services?.join(', ')}
              </div>
              <div>
                <span className="font-medium">Rating:</span> {selectedProvider.rating} ({selectedProvider.total_reviews} reviews)
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-GREY-100 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Performance</p>
            <div className="space-y-3 text-sm text-NEUTRAL-100">
              <div><span className="font-medium">Active Jobs:</span> {selectedProvider.active_jobs}</div>
              <div><span className="font-medium">Completed:</span> {selectedProvider.completed_jobs}</div>
              <div><span className="font-medium">Wallet:</span> {selectedProvider.wallet_balance_formatted}</div>
              <div><span className="font-medium">Status:</span> {selectedProvider.is_open ? 'Open' : 'Closed'}</div>
            </div>
          </div>
        </div>

        {/* Notes field */}
        <div className="flex flex-col">
          <label htmlFor="notes" className="text-xs font-semibold text-GREY-200 mb-2">
            Notes (optional - internal use only)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this verification decision..."
            rows={3}
            className="rounded-lg border border-GREY-100 p-3 text-sm text-NEUTRAL-100 focus:outline-none focus:ring-2 focus:ring-BLUE-400 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-2 border-t border-GREY-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDecline}
            disabled={loading}
            className="rounded-lg border border-RED-300 px-4 py-2.5 text-sm font-medium text-RED-300 hover:bg-RED-100/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <CgSpinner className="animate-spin" /> : <HiOutlineXMark className="w-4 h-4" />}
            Decline
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <CgSpinner className="animate-spin" /> : <HiOutlineCheckBadge className="w-4 h-4" />}
            Verify Provider
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyProvider
