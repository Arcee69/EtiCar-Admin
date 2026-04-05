import { HiOutlineXMark } from "react-icons/hi2"
import { ModalPop } from "../../../components"
import { useEffect, useMemo, useState } from "react"
import type { InventoryItem, InventoryPayload, Vendor } from "../../../types/global"


interface InventoryFormModalProps {
  isOpen: boolean
  title: string
  submitLabel: string
  vendorsList: Vendor[]
  initialValue?: InventoryItem | null
  onClose: () => void
  onSubmit: (payload: InventoryPayload) => void
}

const InventoryFormModal = ({
  isOpen,
  title,
  submitLabel,
  vendorsList,
  initialValue,
  onClose,
  onSubmit,
}: InventoryFormModalProps) => {
  const [sku, setSku] = useState('')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [vendorId, setVendorId] = useState(vendorsList[0]?.id ?? '')
  const [unitPrice, setUnitPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)


  useEffect(() => {
    if (initialValue) {
      setSku(initialValue.sku)
      setProductName(initialValue.productName)
      setCategory(initialValue.category)
      setVendorId(initialValue.vendorId)
      setUnitPrice(initialValue.unitPrice)
      setQuantity(initialValue.quantity)

      return
    }

    setSku('')
    setProductName('')
    setCategory('')
    setVendorId(vendorsList[0]?.id ?? '')
    setUnitPrice(0)
    setQuantity(0)
  }, [initialValue, vendorsList])

  const canSubmit = useMemo(() => {
    return (
      sku.trim().length > 2 &&
      productName.trim().length > 2 &&
      category.trim().length > 2 &&
      vendorId.length > 0 &&
      unitPrice > 0 &&
      quantity >= 0 
    )
  }, [category, productName, quantity, sku, unitPrice, vendorId])

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }

    onSubmit({
      sku: sku.trim().toUpperCase(),
      productName: productName.trim(),
      category: category.trim(),
      vendorId,
      unitPrice,
      quantity
    })
    onClose()
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-xl h-120 border border-GREY-100 bg-white p-5 md:p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-NEUTRAL-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close inventory modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">SKU</span>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. BRK-TY-001"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Product Name</span>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Brake Pads (Toyota)"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Category</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Braking System"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Vendor</span>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="rounded-lg border border-GREY-100 bg-white px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            >
              {vendorsList.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Unit Price (NGN)</span>
            <input
              type="number"
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value || 0))}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Quantity</span>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value || 0))}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default InventoryFormModal