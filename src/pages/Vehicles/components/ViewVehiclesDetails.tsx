import { HiOutlineXMark } from 'react-icons/hi2'
import type { VehiclesData } from '../../../types/global'
import { formatDate } from '../../../helper'

interface VehicleDetailsProps {
    handleClose: () => void
    vehicleDetails: VehiclesData | null
}

const ViewVehiclesDetails = ({handleClose, vehicleDetails }: VehicleDetailsProps) => {
  if (!vehicleDetails) return null

  return (
    <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
        <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-NEUTRAL-100">Vehicle Details</h2>
            <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                aria-label="Close vehicle modal"
            >
                <HiOutlineXMark className="h-5 w-5" />
            </button>
        </div>

        <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex flex-wrap gap-2">
                <span
                    className="inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${vehicleDetails.status_color}20`, color: vehicleDetails.status_color, border: `1px solid ${vehicleDetails.status_color}40` }}
                >
                    {vehicleDetails.status_label}
                </span>
            </div>

            {/* Vehicle ID */}
            <section>
                <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">Vehicle ID</h3>
                <div className="bg-GREY-50 rounded-lg p-4">
                    <code className="text-NEUTRAL-100 text-sm font-mono block break-all">{vehicleDetails.id}</code>
                </div>
            </section>

            {/* Vehicle Information */}
            <section>
                <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Vehicle Information</h3>
                <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Make</span>
                        <span className="text-NEUTRAL-100 text-sm font-medium">{vehicleDetails.make}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Model</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.model}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Year</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.year}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Plate Number</span>
                        <span className="text-NEUTRAL-100 text-sm font-medium">{vehicleDetails.plate_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">VIN</span>
                        <span className="text-NEUTRAL-100 text-sm font-mono">{vehicleDetails.vin || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Color</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.color}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Vehicle Type</span>
                        <span className="text-NEUTRAL-100 text-sm capitalize">{vehicleDetails.vehicle_type}</span>
                    </div>
                </div>
            </section>

            {/* Owner Information */}
            <section>
                <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Owner Information</h3>
                <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Name</span>
                        <span className="text-NEUTRAL-100 text-sm font-medium">{vehicleDetails.owner_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Phone</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.owner_phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Email</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.owner.email || 'N/A'}</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section>
                <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Features</h3>
                <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Seat Capacity</span>
                        <span className="text-NEUTRAL-100 text-sm font-medium">{vehicleDetails.seat_capacity || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Air Conditioning</span>
                        <span className="text-NEUTRAL-100 text-sm">{vehicleDetails.is_ac ? 'Yes' : 'No'}</span>
                    </div>
                </div>
            </section>

            {/* Vehicle Image */}
            {vehicleDetails.primary_image_url && (
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Vehicle Image</h3>
                    <img
                        src={vehicleDetails.primary_image_url}
                        alt={`${vehicleDetails.make} ${vehicleDetails.model}`}
                        className="w-48 h-48 object-cover rounded-lg border border-GREY-100"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </section>
            )}

            {/* Timestamps */}
            <section>
                <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Details</h3>
                <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Created At</span>
                        <span className="text-NEUTRAL-100 text-sm">{formatDate(vehicleDetails.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-GREY-200 text-sm">Last Updated</span>
                        <span className="text-NEUTRAL-100 text-sm">{formatDate(vehicleDetails.updated_at)}</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
  )
}

export default ViewVehiclesDetails