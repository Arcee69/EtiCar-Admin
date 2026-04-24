import { HiOutlineXMark } from "react-icons/hi2"
import type { ServiceRequestData } from "../../../types/global"

interface ViewServiceRequestDetailsProps {
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

const ViewServiceRequestDetails = ({ handleClose, serviceRequestDetails }: ViewServiceRequestDetailsProps) => {
    if (!serviceRequestDetails) return null


    const getStatusStyle = (status: string) => {
        return statusBadgeStyle[status as ServiceStatus] || 'bg-gray-50 text-gray-600 border border-gray-200'
    }

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Service Request Details</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close details modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(serviceRequestDetails.status)}`}>
                        {serviceRequestDetails.status}
                    </span>
                </div>

                {/* Request ID */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">Request ID</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <code className="text-NEUTRAL-100 text-sm font-mono block break-all">
                            {serviceRequestDetails.request_id_short}
                        </code>
                    </div>
                </section>

                {/* Driver & Vehicle */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Driver & Vehicle</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Driver Name</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{serviceRequestDetails.driver}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Driver Phone</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.driver_phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Vehicle</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.vehicle}</span>
                        </div>
                    </div>
                </section>

                {/* Service Details */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Service Details</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Service Type</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{serviceRequestDetails.service_type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Quoted Price</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">
                                {serviceRequestDetails.quoted_price_formatted}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Scheduled At</span>
                            <span className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.scheduled_at_human}</span>
                        </div>
                        {serviceRequestDetails.notes && (
                            <div className="flex justify-between">
                                <span className="text-GREY-200 text-sm">Notes</span>
                                <span className="text-NEUTRAL-100 text-sm text-right max-w-xs">
                                    {serviceRequestDetails.notes}
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Provider */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Provider</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Provider Name</span>
                            <span className={`text-NEUTRAL-100 text-sm ${serviceRequestDetails.provider === 'Unassigned' ? 'italic text-GREY-200' : ''}`}>
                                {serviceRequestDetails.provider}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Address */}
                {serviceRequestDetails.address && (
                    <section>
                        <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Service Address</h3>
                        <div className="bg-GREY-50 rounded-lg p-4">
                            <p className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.address}</p>
                        </div>
                    </section>
                )}

                {/* Cancellation Reason */}
                {serviceRequestDetails.cancellation_reason && (
                    <section>
                        <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Cancellation Reason</h3>
                        <div className="bg-GREY-50 rounded-lg p-4">
                            <p className="text-NEUTRAL-100 text-sm">{serviceRequestDetails.cancellation_reason}</p>
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}

export default ViewServiceRequestDetails
