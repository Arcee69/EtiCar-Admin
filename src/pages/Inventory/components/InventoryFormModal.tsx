import { HiOutlineXMark, HiOutlineCloudArrowUp } from "react-icons/hi2"
import { ModalPop } from "../../../components"
import { useEffect, useMemo, useState, useCallback } from "react"
import type { InventoryData, InventoryPayload, InventoryReferenceData } from "../../../types/global"
import { uploadImageToCloudinary } from "../../../utils/cloudinary"
import { toast } from "sonner"

interface InventoryFormModalProps {
  isOpen: boolean
  title: string
  submitLabel: string
  vendorsList: InventoryReferenceData['vendors']
  categoryList: InventoryReferenceData['categories']
  initialValue?: InventoryData | null
  onClose: () => void
  onSubmit: (payload: InventoryPayload) => void
}

const InventoryFormModal = ({
  isOpen,
  title,
  submitLabel,
  vendorsList,
  categoryList,
  initialValue,
  onClose,
  onSubmit,
}: InventoryFormModalProps) => {
  const [sku, setSku] = useState('')
  const [productName, setProductName] = useState('')
  const [categoryId, setCategoryId] = useState(categoryList[0]?.id ?? '')
  const [vendorId, setVendorId] = useState(vendorsList[0]?.id ?? '')
  const [unitPrice, setUnitPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [description, setDescription] = useState('')

  const handleReset = useCallback(() => {
    setSku('')
    setProductName('')
    setCategoryId(categoryList[0]?.id ?? '')
    setVendorId(vendorsList[0]?.id ?? '')
    setUnitPrice(0)
    setQuantity(0)
    setImageFile(null)
    setImagePreview('')
    setImageRemoved(false)
    setDescription('')
  }, [categoryList, vendorsList])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setImageFile(file)
    setImageRemoved(false)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setImageRemoved(true)
  }

   useEffect(() => {
    if (initialValue) {
      setSku(initialValue.sku)
      setProductName(initialValue.name)
      setCategoryId(initialValue.category.id)
      setVendorId(initialValue.vendor.id)
      setUnitPrice(parseFloat(initialValue.price))
      setQuantity(parseInt(initialValue.stock_quantity, 10))
      // Set image preview if product has an image
      if (initialValue.image_url) {
        setImagePreview(initialValue.image_url)
      } else {
        setImagePreview('')
      }
      setImageRemoved(false)

      return
    }

    handleReset()
  }, [initialValue, categoryList, vendorsList, handleReset])

  const canSubmit = useMemo(() => {
    return (
      sku.trim().length > 2 &&
      productName.trim().length > 2 &&
      categoryId.length > 0 &&
      vendorId.length > 0 &&
      unitPrice > 0 &&
      quantity >= 0
    )
  }, [categoryId, productName, quantity, sku, unitPrice, vendorId])

  const handleSubmit = async () => {
    if (!canSubmit) {
      return
    }

    try {
      setUploading(true)

      let imageUrl = initialValue?.image_url || ''

      // Handle image removal
      if (imageRemoved) {
        imageUrl = ''
      } else if (imageFile) {
        // Upload new image if selected
        imageUrl = await uploadImageToCloudinary(imageFile)
      }

      onSubmit({
        sku: sku.trim().toUpperCase(),
        name: productName.trim(),
        category_id: categoryId,
        provider_id: vendorId,
        price: unitPrice.toString(),
        stock_quantity: quantity.toString(),
        description: description.trim(),
        image_url: imageUrl,
        currency: 'NGN',
        is_available: true,
      })
      onClose()
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-xl border border-GREY-100 bg-white p-5 md:p-6 shadow-xl mt-10 max-h-[80vh] overflow-y-auto"
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
          {/* Product Image Upload */}
          <div className="md:col-span-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-NEUTRAL-100">Product Image</span>
              <div className="flex flex-col items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border border-GREY-100"
                      onError={(e) => {
                        e.currentTarget.src = ''
                        setImagePreview('')
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 rounded-full bg-RED-300 p-1 text-white hover:bg-RED-400"
                      aria-label="Remove image"
                    >
                      <HiOutlineXMark className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-GREY-100 rounded-lg cursor-pointer hover:border-BLUE-400 transition-colors">
                    <div className="flex flex-col items-center p-4">
                      <HiOutlineCloudArrowUp className="w-8 h-8 text-GREY-200 mb-2" />
                      <span className="text-xs text-GREY-200 text-center">Click to upload</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-GREY-200 mt-1">
                  Max file size: 5MB. Supported: JPG, PNG, WEBP
                </p>
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">SKU *</span>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. BRK-TY-001"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Product Name *</span>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Brake Pads (Toyota)"
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Category *</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-lg border border-GREY-100 bg-white px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            >
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Vendor *</span>
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
            <span className="text-sm font-medium text-NEUTRAL-100">Unit Price (NGN) *</span>
            <input
              type="number"
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value || 0))}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-NEUTRAL-100">Quantity *</span>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value || 0))}
              className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
            />
          </label>

          <div className="md:col-span-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-NEUTRAL-100">Description *</span>
              <textarea              
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Brake Pads for Toyota Camry 2015-2018"
                className="rounded-lg border border-GREY-100 px-3 py-2.5 text-sm text-NEUTRAL-100 outline-none focus:border-BLUE-400 focus:ring-2 focus:ring-BLUE-400/20"
              ></textarea>
            </label>
          </div>

        </div>


        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-GREY-100 px-4 py-2 text-sm font-medium text-NEUTRAL-100 hover:bg-GREY-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || uploading}
            className="rounded-lg bg-BLUE-100 px-4 py-2 text-sm font-medium text-white hover:bg-BLUE-300 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? 'Uploading...' : submitLabel}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}

export default InventoryFormModal
