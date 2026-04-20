import { HiOutlineXMark } from "react-icons/hi2"
import type { Vendor } from "../../../types/global"


interface VendorDetailsProps {
    handleClose: () => void
    vendorDetails: Vendor | null
}

const VendorDetails = ({ handleClose, vendorDetails }: VendorDetailsProps) => {
    if (!vendorDetails) return null

    const verificationStatusStyles = {
        pending: 'bg-orange-50 text-orange-500 border border-orange-200',
        verified: 'bg-green-50 text-green-600 border border-green-200',
        declined: 'bg-red-50 text-red-500 border border-red-200',
    }

    const statusStyles = {
        active: 'bg-green-50 text-green-600 border border-green-200',
        pending: 'bg-orange-50 text-orange-500 border border-orange-200',
        suspended: 'bg-red-50 text-red-500 border border-red-200',
    }

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Vendor Details</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close vendor modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Verification & Status Badges */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${verificationStatusStyles[vendorDetails.verification_status]}`}>
                        {vendorDetails.verification_status}
                    </span>
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[vendorDetails.status]}`}>
                        {vendorDetails.status}
                    </span>
                </div>

                {/* Vendor ID */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">Vendor ID</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <code className="text-NEUTRAL-100 text-sm font-mono block break-all">{vendorDetails.id}</code>
                    </div>
                </section>

                {/* Vendor Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Vendor Information</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Vendor Name</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{vendorDetails.vendor_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Business Name</span>
                            <span className="text-NEUTRAL-100 text-sm">{vendorDetails.business_name}</span>
                        </div>
                    </div>
                </section>

                {/* Location Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Location</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">City</span>
                            <span className="text-NEUTRAL-100 text-sm capitalize">{vendorDetails.location.city}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">State</span>
                            <span className="text-NEUTRAL-100 text-sm capitalize">{vendorDetails.location.state}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Business Address</span>
                            <span className="text-NEUTRAL-100 text-sm text-right">{vendorDetails.business_address}</span>
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Statistics</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Products</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{vendorDetails.products_count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Orders Fulfilled</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{vendorDetails.orders_fulfilled}</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default VendorDetails