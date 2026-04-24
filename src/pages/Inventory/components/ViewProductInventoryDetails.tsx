import { HiOutlineXMark } from 'react-icons/hi2'
import { ModalPop } from '../../../components'
import type { InventoryData } from '../../../types/global'
import { formatCurrency } from '../../../helper'

interface ViewProductInventoryDetailsProps {
  isOpen: boolean
  handleClose: () => void
  item: InventoryData | null
}

const ViewProductInventoryDetails = ({ isOpen, handleClose, item }: ViewProductInventoryDetailsProps) => {

    const getStockStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-700'
            case 'low_stock':
                return 'bg-orange-100 text-orange-600'
            case 'out_of_stock':
                return 'bg-red-100 text-red-300'
            case 'medium':
                return 'bg-blue-100 text-blue-600'
            default:
                return 'bg-grey-100 text-grey-600'
        }
    }

  return (
    <ModalPop isOpen={isOpen} closeModal={handleClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-GREY-100 h-160 mt-10 bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">Inventory Details</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close inventory details"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {item && (
          <div className="space-y-6">
            {/* Product Image */}
            {item.image_url && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-GREY-200 uppercase tracking-wider">Product Image</h3>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded-lg border border-GREY-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Basic Info */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-GREY-200 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-GREY-200">SKU</p>
                  <p className="font-medium text-NEUTRAL-100">{item.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-GREY-200">Product Name</p>
                  <p className="font-medium text-NEUTRAL-100">{item.name}</p>
                </div>
                <div>
                  <p className="text-sm text-GREY-200">Category</p>
                  <p className="font-medium text-NEUTRAL-100">{item.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-GREY-200">Vendor</p>
                  <p className="font-medium text-NEUTRAL-100">{item.vendor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-GREY-200">Unit Price</p>
                  <p className="font-medium text-NEUTRAL-100">{formatCurrency(item.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-GREY-200">Quantity</p>
                  <p className="font-medium text-NEUTRAL-100">{item.stock_quantity}</p>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-GREY-200 uppercase tracking-wider">Stock Status</h3>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStockStatusColor(item.stock_status)}`}>
                  {item.stock_status_label}
                </span>
                <span className="text-sm text-GREY-200">
                  {item.is_available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-GREY-200 uppercase tracking-wider">Description</h3>
                <p className="text-NEUTRAL-100">{item.description}</p>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-GREY-200 uppercase tracking-wider">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-GREY-200">Created At</p>
                  <p className="text-NEUTRAL-100">{item.created_at_formatted}</p>
                </div>
                <div>
                  <p className="text-GREY-200">Last Updated</p>
                  <p className="text-NEUTRAL-100">{new Date(item.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
            <button
                type="button"
                onClick={handleClose}
                className="rounded-lg bg-BLUE-100 px-4 py-2 cursor-pointer text-sm font-medium text-white hover:bg-BLUE-300"
            >
            Close
            </button>
        </div>
      </div>

    </ModalPop>
  )
}

export default ViewProductInventoryDetails
