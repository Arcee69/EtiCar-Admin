import { useState } from 'react'
import type { Wallet } from '../../../types/global';
import { toast } from 'sonner';
import { walletApi } from '../../../services/wallet';
import { CgSpinner } from 'react-icons/cg';
import { HiOutlineXMark } from 'react-icons/hi2';

interface UpdateWalletStatusProps {
    handleClose: () => void;
    walletDetails: Wallet | null;
    onUpdate?: () => void; // Callback to refresh wallet list
}
const UpdateWalletStatus = ({ handleClose, walletDetails, onUpdate }: UpdateWalletStatusProps) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');

    const getAction = () => {
        if (!walletDetails) return null;
        return walletDetails.is_frozen ? 'unfreeze' : 'freeze';
    }

    const getActionLabel = () => {
        const action = getAction();
        if (!action) return '';
        return action === 'unfreeze' ? 'Unfreeze Wallet' : 'Freeze Wallet';
    }

    const getConfirmationMessage = () => {
        const action = getAction();
        if (!action) return '';
        return action === 'unfreeze'
            ? 'Are you sure you want to unfreeze this wallet? The user will be able to access their funds.'
            : 'Are you sure you want to freeze this wallet? The user will no longer be able to access their funds.';
    }

    const handleUpdateVendorStatus = async () => {
        if (!walletDetails?.id) {
            toast.error("Wallet ID is required");
            return;
        }

        const newStatus = getAction();
        if (!newStatus) {
            toast.error("Invalid status transition");
            return;
        }

        try {
            setLoading(true);
            await walletApi.updateWalletStatus(walletDetails.id, newStatus, reason);
            toast.success(`Wallet ${newStatus === 'unfreeze' ? 'unfrozen' : 'frozen'} successfully.`);
            await onUpdate?.(); // Refresh the wallet list
            handleClose();
        } catch (error: unknown) {
            const message =
                (error as any)?.response?.data?.message ||
                `Failed to ${newStatus} wallet. Please try again.`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    if (!walletDetails) return null;

    const action = getAction();
    const actionLabel = getActionLabel();

    return (
        <div className="bg-white max-w-md p-4 mt-20 h-90 shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Update Wallet Status</h2>
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

                {/* Reason for Action */}
                <div className="mb-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-NEUTRAL-100 mb-2">
                        Reason
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-2 border border-GREY-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-BLUE-100"
                        rows={3}
                        placeholder="Enter reason for freezing the wallet"
                    />
                </div>
                

                {/* Action Button */}
                <div className="flex items-center justify-end gap-5">
                    <button
                        className={`${action === 'unfreeze' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'} border-none text-white rounded-lg p-3 cursor-pointer w-auto h-11.5 flex justify-center transition-colors`}
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

export default UpdateWalletStatus