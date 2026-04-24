import { useState, useEffect } from 'react'
import { HiOutlineXMark } from "react-icons/hi2"
import type { ServiceRequestData, ProvidersData } from "../../../types/global"
import { serviceRequestsApi } from "../../../services/serviceRequests"
import { providersApi } from "../../../services/providers"
import { toast } from 'sonner'

interface AssignServiceRequestProviderProps {
    handleClose: () => void
    serviceRequestDetails: ServiceRequestData | null
    onUpdate?: () => void
}

const AssignServiceRequestProvider = ({ handleClose, serviceRequestDetails, onUpdate }: AssignServiceRequestProviderProps) => {
    const [selectedProviderId, setSelectedProviderId] = useState<string>('')
    const [providers, setProviders] = useState<Pick<ProvidersData, 'id' | 'verification_status' | 'business_name' | 'services'>[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    

    useEffect(() => {
        if (serviceRequestDetails) {
            setSelectedProviderId(serviceRequestDetails.provider_id || '')
        }
    }, [serviceRequestDetails])

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await providersApi.getProviders({ per_page: 100 })
                setProviders(response.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch providers')
            } finally {
                setLoading(false)
            }
        }
        fetchProviders()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!serviceRequestDetails || !selectedProviderId) return

        try {
            setSubmitLoading(true)
            await serviceRequestsApi.assignProvider(serviceRequestDetails.id, selectedProviderId)
            toast.success('Provider assigned successfully')
            if (onUpdate) onUpdate()
            handleClose()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to assign provider')
        } finally {
            setSubmitLoading(false)
        }
    }

    if (!serviceRequestDetails) return null

    // Filter to show only verified providers
    const availableProviders = providers.filter(p => p.verification_status === 'verified')

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Assign Service Request</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close assign modal"
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
                    </div>
                </section>

                {/* Provider Selection */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">
                        Select Provider
                    </h3>
                    {loading ? (
                        <div className="text-NEUTRAL-100 text-sm">Loading providers...</div>
                    ) : error ? (
                        <div className="text-RED-300 text-sm">{error}</div>
                    ) : availableProviders.length === 0 ? (
                        <div className="text-GREY-200 text-sm">No verified providers available</div>
                    ) : (
                        <div className="space-y-3">
                            <select
                                value={selectedProviderId}
                                onChange={(e) => setSelectedProviderId(e.target.value)}
                                className="w-full pl-4 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Choose a provider...</option>
                                {availableProviders.map(provider => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.business_name} - {provider.services.join(', ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </section>


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
                        disabled={!selectedProviderId || submitLoading}
                        className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-BLUE-400 hover:bg-BLUE-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitLoading ? 'Assigning...' : 'Assign Provider'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AssignServiceRequestProvider