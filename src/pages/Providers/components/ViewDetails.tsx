import { 
    HiOutlineXMark,
    HiOutlineIdentification, 
    HiOutlineMapPin, 
    HiOutlineWrenchScrewdriver, 
    HiOutlinePhone, 
    HiOutlineDocumentText, 
    HiOutlineCheckBadge 
} from 'react-icons/hi2'
import type { Provider } from '../../../types/global'
import { Button } from '../../../components'

interface ProviderVerificationModalProps {
    selectedProvider: Provider | null
    closeVerificationModal: () => void
    updateVerificationStatus: (id: string, status: string) => void
    statusClassMap: Record<string, string>
}
const ViewDetails = ({
    selectedProvider,
    closeVerificationModal,
    updateVerificationStatus,
    statusClassMap  
}:ProviderVerificationModalProps) => {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-2xl border border-GREY-100 h-160 bg-white shadow-xl"
        >
            <div className="flex items-start justify-between border-b border-GREY-100 px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-NEUTRAL-100">Provider Verification Details</h2>
                    <p className="mt-1 text-sm text-GREY-200">Review submitted profile and documents before approving.</p>
                </div>
                <button
                    type="button"
                    onClick={closeVerificationModal}
                    className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close provider verification modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            {selectedProvider && (
                <div className="space-y-5 px-6 py-5">
                    <div className="flex flex-col gap-3 rounded-xl border border-GREY-100 bg-GREY-800/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-base font-semibold text-NEUTRAL-100">{selectedProvider.name}</p>
                            <p className="text-sm text-GREY-200">Provider ID: {selectedProvider.id}</p>
                        </div>
                        <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClassMap[selectedProvider.status]}`}
                        >
                            {selectedProvider.status}
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-GREY-100 p-4">
                            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Business Information</p>
                            <div className="space-y-3 text-sm text-NEUTRAL-100">
                                <div className="flex items-center gap-2">
                                    <HiOutlineIdentification className="h-4 w-4 text-GREY-200" />
                                    <span>{selectedProvider.businessType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineMapPin className="h-4 w-4 text-GREY-200" />
                                    <span>{selectedProvider.city}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineWrenchScrewdriver className="h-4 w-4 text-GREY-200" />
                                    <span>{selectedProvider.services.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-GREY-100 p-4">
                            <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">Contact Information</p>
                            <div className="space-y-3 text-sm text-NEUTRAL-100">
                                <div className="flex items-center gap-2">
                                    <HiOutlinePhone className="h-4 w-4 text-GREY-200" />
                                    <span>{selectedProvider.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineDocumentText className="h-4 w-4 text-GREY-200" />
                                    <span>{selectedProvider.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiOutlineCheckBadge className="h-4 w-4 text-GREY-200" />
                                    <span>Registered: {selectedProvider.registrationDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-GREY-100 p-4">
                        <p className="mb-3 text-xs font-semibold tracking-wide text-GREY-200 uppercase">KYC Documents</p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border border-GREY-100 bg-GREY-800/20 p-3">
                                <p className="text-xs font-medium text-GREY-200">ID Card</p>
                                <p className="mt-1 text-sm text-NEUTRAL-100">{selectedProvider.documents.idCard}</p>
                            </div>
                            <div className="rounded-lg border border-GREY-100 bg-GREY-800/20 p-3">
                                <p className="text-xs font-medium text-GREY-200">Business Registration</p>
                                <p className="mt-1 text-sm text-NEUTRAL-100">{selectedProvider.documents.businessRegistration}</p>
                            </div>
                            <div className="rounded-lg border border-GREY-100 bg-GREY-800/20 p-3">
                                <p className="text-xs font-medium text-GREY-200">Address Proof</p>
                                <p className="mt-1 text-sm text-NEUTRAL-100">{selectedProvider.documents.addressProof}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-GREY-100 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            onClick={() => updateVerificationStatus(selectedProvider?.id, 'Declined')}
                            className="rounded-lg border cursor-pointer border-RED-300 px-4 py-2.5 text-sm font-medium text-RED-300 hover:bg-RED-100/10"
                            title="Decline"
                        />
                        <Button
                            type="button"
                            onClick={() => updateVerificationStatus(selectedProvider?.id, 'Verified')}
                            className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                            title="Verify"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewDetails