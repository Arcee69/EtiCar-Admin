import {
  HiOutlineXMark,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlineWrenchScrewdriver,
  HiOutlinePhone,
  HiOutlineCheckBadge
} from 'react-icons/hi2'
import type { ProvidersData } from '../../../types/global'
import { Button } from '../../../components'

interface ViewProviderDetailsProps {
  selectedProvider: ProvidersData | null
  handleClose: () => void
  statusClassMap: Record<string, string>
}

const ViewProviderDetails = ({
  selectedProvider,
  handleClose,
  statusClassMap
}: ViewProviderDetailsProps) => {
  if (!selectedProvider) return null

  const statusKey = (selectedProvider.verification_status || '').toLowerCase()
  const statusLabel = selectedProvider.verification_status_label || selectedProvider.verification_status
  const statusClass = statusClassMap[statusKey] || statusClassMap['']

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-3xl rounded-2xl border border-GREY-100 h-auto max-h-[80vh] mt-10 overflow-y-auto bg-white shadow-xl"
    >
      <div className="flex items-start justify-between border-b border-GREY-100 px-6 py-4 sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Provider Details</h2>
          <p className="mt-1 text-sm text-GREY-200">Review provider profile and information.</p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
          aria-label="Close provider details modal"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-5">
        {/* Provider Header */}
        <div className="flex flex-col gap-3 rounded-xl border border-GREY-100 bg-GREY-800/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-NEUTRAL-100">{selectedProvider.business_name}</p>
            <p className="text-sm text-GREY-200">Provider ID: {selectedProvider.id}</p>
          </div>
          <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        {/* Information Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Business Info */}
          <div className="rounded-xl border border-GREY-100 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Business Information</p>
            <div className="space-y-3 text-sm text-NEUTRAL-100">
              <div className="flex items-center gap-2">
                <HiOutlineIdentification className="h-4 w-4 text-GREY-200" />
                <span>Service Types: {selectedProvider.service_types?.join(', ') || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="h-4 w-4 text-GREY-200" />
                <span>City: {selectedProvider.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineWrenchScrewdriver className="h-4 w-4 text-GREY-200" />
                <span>Services: {selectedProvider.services?.join(', ') || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckBadge className="h-4 w-4 text-GREY-200" />
                <span>Rating: {selectedProvider.rating} ({selectedProvider.total_reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-GREY-100 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Contact Information</p>
            <div className="space-y-3 text-sm text-NEUTRAL-100">
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="h-4 w-4 text-GREY-200" />
                <span>{selectedProvider.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckBadge className="h-4 w-4 text-GREY-200" />
                <span>Registered: {new Date(selectedProvider.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedProvider.is_online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedProvider.is_online ? 'Online' : 'Offline'}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedProvider.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {selectedProvider.is_open ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-GREY-100 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Performance Stats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-NEUTRAL-100">{selectedProvider.active_jobs}</p>
              <p className="text-xs text-GREY-200">Active Jobs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-NEUTRAL-100">{selectedProvider.completed_jobs}</p>
              <p className="text-xs text-GREY-200">Completed</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-NEUTRAL-100">{selectedProvider.wallet_balance_formatted}</p>
              <p className="text-xs text-GREY-200">Wallet Balance</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-NEUTRAL-100">{selectedProvider.rating}</p>
              <p className="text-xs text-GREY-200">Rating</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-GREY-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={handleClose}
            className="rounded-lg border cursor-pointer border-GREY-100 px-4 py-2.5 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300"
            title="Close"
          />
        </div>
      </div>
    </div>
  )
}

export default ViewProviderDetails
