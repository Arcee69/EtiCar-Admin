import { HiOutlineXMark } from "react-icons/hi2";
import type { WalletData } from "../../../types/global";
import { formatNaira } from "../../../helper";

interface WalletDetailsProps {
    handleClose: () => void;
    walletDetails: WalletData | null;
}

const WalletDetails = ({ handleClose, walletDetails }: WalletDetailsProps) => {
    if (!walletDetails) return null;

    const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Wallet Details</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close wallet modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Wallet ID */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">Wallet ID</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <code className="text-NEUTRAL-100 text-sm font-mono block break-all">{walletDetails.id}</code>
                    </div>
                </section>

                {/* Wallet Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Wallet Information</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">User Name</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{walletDetails.user.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">User Email</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">User Phone</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.user.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">User Type</span>
                            <span className="text-NEUTRAL-100 text-sm capitalize">{walletDetails.user.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Provider Verification</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.user.provider_verification}</span>
                        </div>
                    </div>
                </section>

                {/* Wallet Details */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Wallet Details</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Wallet Type</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium capitalize">{walletDetails.type_label}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Currency</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.currency}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Balance</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{formatNaira(walletDetails.balance)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Ledger Balance</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{formatNaira(walletDetails.ledger_balance)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Frozen</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatBoolean(walletDetails.is_frozen)}</span>
                        </div>
                    </div>
                </section>

                {/* Transaction Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Transaction Information</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Last Transaction</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.last_transaction}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Last Transaction Date</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.last_transaction_at}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Total Transactions</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.transactions_count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Created At</span>
                            <span className="text-NEUTRAL-100 text-sm">{walletDetails.created_at_formatted}</span>
                        </div>
                    </div>
                </section>

                {/* User Status */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">User Status</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Is Deleted</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatBoolean(walletDetails.user.is_deleted)}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default WalletDetails