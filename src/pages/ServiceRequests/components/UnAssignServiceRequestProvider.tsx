import { useState } from 'react'
import { HiOutlineXMark } from "react-icons/hi2"
import type { ServiceRequestData } from "../../../types/global"
import { serviceRequestsApi } from "../../../services/serviceRequests"
import { toast } from 'sonner'

interface UnAssignServiceRequestProviderProps {
    handleClose: () => void
    serviceRequestDetails: ServiceRequestData | null
    onUpdate?: () => void
}

const UnAssignServiceRequestProvider = ({ handleClose, serviceRequestDetails, onUpdate }: UnAssignServiceRequestProviderProps) => {
    const [submitLoading, setSubmitLoading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!serviceRequestDetails) return

        try {
            setSubmitLoading(true)
            setSubmitError(null)
            await serviceRequestsApi.unassignProvider(serviceRequestDetails.id)
            toast.success('Provider unassigned successfully')
            if (onUpdate) onUpdate()
            handleClose()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to unassign provider')
        } finally {
            setSubmitLoading(false)
        }
    }

    if (!serviceRequestDetails) return null

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-RED-300">Unassign Provider</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close unassign modal"
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
                            <span className="text-GREY-200 text-sm">Vehicle</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Current Provider</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.provider}</span>
                        </div>
                    </div>
                </section>

                {/* Error Message */}
                {submitError && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                        {submitError}
                    </div>
                )}

                {/* Warning */}
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg text-sm">
                    This action will remove the assigned provider from this service request. The request will return to an unassigned state.
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-GREY-100">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border border-GREY-100 rounded-lg text-sm font-medium text-NEUTRAL-100 bg-white hover:bg-GREY-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-RED-300 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitLoading ? 'Unassigning...' : 'Confirm Unassign'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UnAssignServiceRequestProvider
