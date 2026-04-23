import { HiOutlineXMark } from "react-icons/hi2";
import type { OrdersData } from "../../../types/global";
import { formatNaira } from "../../../helper";

interface OrderDetailsProps {
    handleClose: () => void
    orderDetails: OrdersData | null
}

type OrderStatus = 'delivered' | 'pending' | 'shipped' | 'cancelled' | 'confirmed'

const statusStyles: Record<OrderStatus, string> = {
  'confirmed': 'bg-blue-100 text-BLUE-400',
  'shipped': 'bg-blue-50 text-BLUE-200',
  'pending': 'bg-orange-100 text-orange-600',
  'cancelled': 'bg-red-100 text-RED-300',
  'delivered': 'bg-green-100 text-GREEN-400',
}

const OrderDetails = ({ handleClose, orderDetails }: OrderDetailsProps) => {

    if (!orderDetails) {
        return (
            <div className="bg-white min-w-md p-4 mt-20 h-50 shadow rounded-lg">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-NEUTRAL-100">Order Details</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                        aria-label="Close order modal"
                    >
                        <HiOutlineXMark className="h-5 w-5" />
                    </button>
                </div>
                <div className="text-NEUTRAL-500 text-sm">No order data available.</div>
            </div>
        );
    }

    return (
        <div className="bg-white min-w-lg p-4 mt-20 max-h-[80vh] overflow-y-auto shadow rounded-lg">
            <div className="mb-5 flex items-center justify-between sticky top-0 bg-white pb-4 border-b border-GREY-100">
                <h2 className="text-lg font-semibold text-NEUTRAL-100">Order Details</h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-GREY-200 cursor-pointer hover:bg-GREY-300 hover:text-NEUTRAL-100"
                    aria-label="Close order modal"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-4 space-y-6">
                {/* Order Information */}
                <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Order Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-GREY-200">Order Number</p>
                            <p className="text-sm font-medium text-NEUTRAL-100">{orderDetails.order_number}</p>
                        </div>
                        <div>
                            <p className="text-xs text-GREY-200">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs capitalize font-medium ${statusStyles[orderDetails.status as OrderStatus] ?? ''}`}>
                                {orderDetails.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-GREY-200">Created At</p>
                            <p className="text-sm text-NEUTRAL-100">{orderDetails.created_at_human || new Date(orderDetails.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-GREY-200">Total Amount</p>
                            <p className="text-sm font-semibold text-NEUTRAL-100">{formatNaira(orderDetails.total_amount)}</p>
                        </div>
                    </div>
                </div>

                {/* Driver Information */}
                <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Driver</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-GREY-200">Name</p>
                            <p className="text-sm text-NEUTRAL-100">{orderDetails.driver}</p>
                        </div>
                        <div>
                            <p className="text-xs text-GREY-200">Phone</p>
                            <p className="text-sm text-NEUTRAL-100">{orderDetails.driver_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Vendor Information */}
                <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Vendor</h3>
                    <div>
                        <p className="text-xs text-GREY-200">Vendor Name</p>
                        <p className="text-sm text-NEUTRAL-100">{orderDetails.vendor}</p>
                    </div>
                </div>

                {/* Product Summary */}
                <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Products</h3>
                    <div className="mb-3">
                        <p className="text-xs text-GREY-200">Summary</p>
                        <p className="text-sm text-NEUTRAL-100">{orderDetails.product_summary || orderDetails.product}</p>
                    </div>
                    <div>
                        <p className="text-xs text-GREY-200">Quantity</p>
                        <p className="text-sm text-NEUTRAL-100">{orderDetails.quantity}</p>
                    </div>
                </div>

                {/* Order Items */}
                {orderDetails.items && orderDetails.items.length > 0 && (
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Order Items</h3>
                        <div className="space-y-2">
                            {orderDetails.items.map((item, index) => (
                                <div key={index} className="border-b border-GREY-100 last:border-0 pb-2 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-NEUTRAL-100">{item.product_name}</p>
                                            <p className="text-xs text-GREY-200">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-NEUTRAL-100">{formatNaira(item.total_price)}</p>
                                    </div>
                                    <p className="text-xs text-GREY-200 mt-1">Unit Price: {formatNaira(item.unit_price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                {orderDetails.delivery_address && (
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-2 uppercase tracking-wider">Delivery Address</h3>
                        <p className="text-sm text-NEUTRAL-100">{orderDetails.delivery_address}</p>
                    </div>
                )}

                {/* Notes */}
                {orderDetails.notes && (
                    <div className="bg-GREY-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-2 uppercase tracking-wider">Notes</h3>
                        <p className="text-sm text-NEUTRAL-100">{orderDetails.notes}</p>
                    </div>
                )}

                {/* Financial Summary */}
                <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Financial Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-GREY-200">Subtotal</span>
                            <span className="text-sm text-NEUTRAL-100">{formatNaira(orderDetails.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-GREY-200">Delivery Fee</span>
                            <span className="text-sm text-NEUTRAL-100">{formatNaira(orderDetails.delivery_fee)}</span>
                        </div>
                        {orderDetails.discount_amount && parseFloat(orderDetails.discount_amount) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-sm text-GREY-200">Discount</span>
                                <span className="text-sm text-RED-300">-{formatNaira(orderDetails.discount_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-GREY-100">
                            <span className="text-sm font-semibold text-NEUTRAL-100">Total</span>
                            <span className="text-sm font-bold text-NEUTRAL-100">{formatNaira(orderDetails.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Timing Information */}
                {/* <div className="bg-GREY-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-NEUTRAL-100 mb-3 uppercase tracking-wider">Timeline</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {orderDetails.confirmed_at && (
                            <div>
                                <p className="text-xs text-GREY-200">Confirmed At</p>
                                <p className="text-sm text-NEUTRAL-100">{new Date(orderDetails.confirmed_at).toLocaleString()}</p>
                            </div>
                        )}
                        {orderDetails.delivered_at && (
                            <div>
                                <p className="text-xs text-GREY-200">Delivered At</p>
                                <p className="text-sm text-NEUTRAL-100">{new Date(orderDetails.delivered_at).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div> */}

             
            </div>
        </div>
    )
}

export default OrderDetails
