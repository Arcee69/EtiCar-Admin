import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { HiOutlineXMark } from "react-icons/hi2"
import { toast } from "sonner"
import type { Vendor } from "../../../types/global";
import { vendorApi } from "../../../services/vendors"


interface UpdateVendorStatusProps {
    handleClose: () => void;
    vendorDetails: Vendor | null;
    onUpdate?: () => void; // Callback to refresh vendor list
}

const UpdateVendorStatus = ({ handleClose, vendorDetails, onUpdate }: UpdateVendorStatusProps) => {
    const [loading, setLoading] = useState(false);

    const getAction = () => {
        if (!vendorDetails) return null;
        return vendorDetails.status === 'active' ? 'suspend' : 'activate';
    }

    const getActionLabel = () => {
        const action = getAction();
        if (!action) return '';
        return action === 'activate' ? 'Activate Vendor' : 'Suspend Vendor';
    }

    const getConfirmationMessage = () => {
        const action = getAction();
        if (!action) return '';
        return action === 'activate'
            ? 'Are you sure you want to activate this vendor? They will be able to access the platform.'
            : 'Are you sure you want to suspend this vendor? They will no longer be able to access the platform.';
    }

    const handleUpdateVendorStatus = async () => {
        if (!vendorDetails?.id) {
            toast.error("Vendor ID is required");
            return;
        }

        const newStatus = getAction();
        if (!newStatus) {
            toast.error("Invalid status transition");
            return;
        }

        try {
            setLoading(true);
            await vendorApi.updateVendorStatus(vendorDetails.id, newStatus);
            toast.success(`Vendor ${newStatus === 'activate' ? 'activated' : 'suspended'} successfully.`);
            await onUpdate?.(); // Refresh the vendor list
            handleClose();
        } catch (error: unknown) {
            const message =
                (error as any)?.response?.data?.message ||
                `Failed to ${newStatus} vendor. Please try again.`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    if (!vendorDetails) return null;

    const action = getAction();
    const actionLabel = getActionLabel();

    return (
        <div className="bg-white max-w-md p-4 mt-20 h-55 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Update Vendor Status</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close vendor modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-5">
          

                {/* Confirmation Message */}
                <div className="bg-GREY-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-NEUTRAL-100">
                        {getConfirmationMessage()}
                    </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-end gap-5">
                  <button
                    className={`${action === 'activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'} border-none text-white rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors`}
                    onClick={handleUpdateVendorStatus}
                    disabled={loading}
                  >
                      <p className='text-white text-sm text-center font-medium flex items-center gap-2'>
                          {loading ? <CgSpinner className="animate-spin text-lg" /> : actionLabel}
                      </p>
                  </button>

                  {/* Cancel Button */}
                  <button
                    className="bg-white border border-GREY-100 text-NEUTRAL-100 rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center hover:bg-GREY-100 transition-colors"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    <p className='text-NEUTRAL-100 text-sm text-center font-medium'>
                        Cancel
                    </p>
                  </button>
                </div>
            </div>
        </div>
    )
}

export default UpdateVendorStatus