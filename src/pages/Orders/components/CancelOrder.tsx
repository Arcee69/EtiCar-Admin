import { HiOutlineXMark } from "react-icons/hi2";
import type { OrdersData } from "../../../types/global";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { ordersApi } from "../../../services/orders";

interface OrderDetailsProps {
    handleClose: () => void
    orderDetails: OrdersData | null
    onUpdate?: () => void; // Callback to refresh user list
}

const CancelOrder = ({ handleClose, orderDetails, onUpdate }: OrderDetailsProps) => {
    const [loading, setLoading] = useState(false)
    const [reason, setReason] = useState('')

    const handleUpdateVendorStatus = async () => {
        if (!orderDetails?.id) {
            toast.error("Order ID is required");
            return;
        }

        try {
            setLoading(true);
            await ordersApi.cancelOrder(orderDetails.id, reason);
            toast.success(`Order cancelled successfully.`);
            await onUpdate?.();
            handleClose();
        } catch (error: unknown) {
            const message =
                (error as any)?.response?.data?.errors?.reason ||
                `Failed to cancel order. Please try again.`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="bg-white max-w-md p-4 mt-20 h-90 shadow rounded-lg">
        <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-NEUTRAL-100">Cancel Order</h2>
            <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                aria-label="Close vendor modal"
            >
                <HiOutlineXMark className="h-5 w-5" />
            </button>
        </div>

        {/* Confirmation Message */}
        <div className="bg-GREY-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-NEUTRAL-100">
                Are you sure you want to cancel this order? The customer will be notified of the cancellation.
            </p>
        </div>

        {/* Reason for Action */}
        <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-NEUTRAL-100 mb-2">
                Reason
            </label>
            <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-GREY-200 rounded-lg outline-none"
                rows={3}
                placeholder="Enter reason for cancelling the order"
            />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-5">
            <button
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors"
                onClick={handleUpdateVendorStatus}
                disabled={loading}
            >
                <p className='text-white text-sm text-center font-medium flex items-center gap-2'>
                    {loading ? <CgSpinner className="animate-spin text-lg" /> : 'Cancel Order'}
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
  )
}

export default CancelOrder