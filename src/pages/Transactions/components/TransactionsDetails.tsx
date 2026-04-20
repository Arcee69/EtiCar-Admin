import { HiOutlineXMark } from "react-icons/hi2"
import type { Transaction } from "../../../types/global"
import { formatNaira } from "../../../helper"



interface TransactionsDetailsProps {
    handleClose: () => void
    transactionDetails: Transaction | null
}


const TransactionsDetails = ({ handleClose, transactionDetails }: TransactionsDetailsProps) => {
    if (!transactionDetails) return null

    const txTypeStyles = {
        debit: 'bg-red-50 text-red-500 border border-red-200',
        credit: 'bg-teal-50 text-teal-600 border border-teal-200',
    }

    const txStatusStyles = {
        pending: 'bg-orange-50 text-orange-500 border border-orange-200',
        successful: 'bg-green-50 text-green-500 border border-green-200',
        failed: 'bg-red-50 text-red-500 border border-red-200',
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="bg-white min-w-2xl p-4 mt-10 h-120 overflow-y-auto shadow-xl rounded-lg">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Transaction Details</h2>
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

                {/* Transaction Type & Status */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${txTypeStyles[transactionDetails.type]}`}>
                        {transactionDetails.type}
                    </span>
                    <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${txStatusStyles[transactionDetails.status]}`}>
                        {transactionDetails.status}
                    </span>
                </div>

                {/* Transaction ID */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider">Transaction ID</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <code className="text-NEUTRAL-100 text-sm font-mono block break-all">{transactionDetails.id}</code>
                    </div>
                </section>

                {/* User Information */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">User Information</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Name</span>
                            <span className="text-NEUTRAL-100 text-sm font-medium">{transactionDetails.user.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Email</span>
                            <span className="text-NEUTRAL-100 text-sm">{transactionDetails.user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Phone</span>
                            <span className="text-NEUTRAL-100 text-sm">{transactionDetails.user.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">User ID</span>
                            <span className="text-NEUTRAL-100 text-sm font-mono">{transactionDetails.user.id}</span>
                        </div>
                    </div>
                </section>

                {/* Financial Details */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Financial Details</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Amount</span>
                            <span className="text-NEUTRAL-100 text-sm font-semibold">{formatNaira(transactionDetails.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Fee</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatNaira(transactionDetails.fee)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Balance Before</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatNaira(transactionDetails.balance_before)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Balance After</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatNaira(transactionDetails.balance_after)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Currency</span>
                            <span className="text-NEUTRAL-100 text-sm uppercase">{transactionDetails.currency}</span>
                        </div>
                    </div>
                </section>

                {/* Provider Information */}
                {transactionDetails.provider_name && (
                    <section>
                        <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Provider Information</h3>
                        <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-GREY-200 text-sm">Provider Name</span>
                                <span className="text-NEUTRAL-100 text-sm">{transactionDetails.provider_name}</span>
                            </div>
                            {transactionDetails.provider_ref && (
                                <div className="flex justify-between">
                                    <span className="text-GREY-200 text-sm">Provider Reference</span>
                                    <span className="text-NEUTRAL-100 text-sm font-mono">{transactionDetails.provider_ref}</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Description & Metadata */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Description</h3>
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <p className="text-NEUTRAL-100 text-sm leading-relaxed">{transactionDetails.description}</p>
                    </div>
                </section>

                {/* Metadata (if present) */}
                {transactionDetails.metadata && (
                    <section>
                        <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Additional Information</h3>
                        <div className="bg-GREY-50 rounded-lg p-4">
                            <pre className="text-NEUTRAL-100 text-sm whitespace-pre-wrap font-mono">
                                {JSON.stringify(transactionDetails.metadata, null, 2)}
                            </pre>
                        </div>
                    </section>
                )}

                {/* Timestamps */}
                <section>
                    <h3 className="text-sm font-medium text-GREY-200 uppercase tracking-wider mb-3">Timeline</h3>
                    <div className="bg-GREY-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Created</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatDate(transactionDetails.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-GREY-200 text-sm">Last Updated</span>
                            <span className="text-NEUTRAL-100 text-sm">{formatDate(transactionDetails.updated_at)}</span>
                        </div>
                    </div>
                </section>

               
            </div>
        </div>
    )
}

export default TransactionsDetails
