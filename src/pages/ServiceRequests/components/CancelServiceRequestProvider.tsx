import { useState } from 'react'
import { HiOutlineXMark } from "react-icons/hi2"
import type { ServiceRequestData } from "../../../types/global"
import { serviceRequestsApi } from "../../../services/serviceRequests"
import { toast } from 'sonner'

interface CancelServiceRequestProviderProps {
    handleClose: () => void
    serviceRequestDetails: ServiceRequestData | null
    onUpdate?: () => void
}

type ServiceStatus = 'completed' | 'pending' | 'cancelled' | 'in_progress' | 'accepted'

const statusBadgeStyle: Record<ServiceStatus, string> = {
    completed: 'bg-green-50 text-green-600 border border-green-200',
    pending: 'bg-orange-50 text-orange-500 border border-orange-200',
    cancelled: 'bg-red-50 text-red-500 border border-red-200',
    in_progress: 'bg-blue-50 text-blue-600 border border-blue-200',
    accepted: 'bg-purple-50 text-purple-700 border border-purple-200',
}

const CancelServiceRequestProvider = ({ handleClose, serviceRequestDetails, onUpdate }: CancelServiceRequestProviderProps) => {
    const [reason, setReason] = useState('')
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!serviceRequestDetails || !reason.trim()) return

        try {
            setSubmitLoading(true)
            setSubmitError(null)
            await serviceRequestsApi.cancelServiceRequest(serviceRequestDetails.id, reason)
            toast.success('Service request cancelled successfully')
            if (onUpdate) onUpdate()
            handleClose()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to cancel service request')
        } finally {
            setSubmitLoading(false)
        }
    }

    if (!serviceRequestDetails) return null

      const getStatusStyle = (status: string) => {
        return statusBadgeStyle[status as ServiceStatus] || 'bg-gray-50 text-gray-600 border border-gray-200'
    }

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-RED-300">Cancel Service Request</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close cancel modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Request Info */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">
                        Service Request
                    </h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Request ID</span>
                            <span className="text-NEUTRAL-100 text-sm font-mono">
                                {serviceRequestDetails.request_id_short}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Service</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.service_type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Driver</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.driver}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Status</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${getStatusStyle(serviceRequestDetails.status)}`}>
                                {serviceRequestDetails.status}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Cancellation Reason */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">
                        Cancellation Reason
                    </h3>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide a reason for cancellation..."
                        rows={4}
                        className="w-full px-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent bg-white resize-none"
                        required
                    />
                </section>

                {/* Error Message */}
                {submitError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                        {submitError}
                    </div>
                )}

                {/* Warning */}
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm">
                    This action cannot be undone. The service request will be permanently cancelled.
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-GREY-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-GREY-100 rounded-lg text-sm font-medium text-NEUTRAL-100 bg-white hover:bg-GREY-300 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!reason.trim() || submitLoading}
                        className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-RED-300 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitLoading ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CancelServiceRequestProvider