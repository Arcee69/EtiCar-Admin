import { HiOutlineExclamationTriangle, HiOutlineXMark } from "react-icons/hi2"
import { ModalPop } from "../../../components"
import type { DeleteInventoryProps } from "../../../types/global"


const DeleteInventory = ({ isOpen, item, onClose, onDelete, deleteLoading }: DeleteInventoryProps) => {
  const handleDelete = () => {
    if (!item) {
      return
    }
    onDelete(item.id)
    onClose()
  }

  return (
    <ModalPop isOpen={isOpen} closeModal={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-GREY-100 h-50 mt-20 bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-RED-100/15 p-2 text-RED-300">
              <HiOutlineExclamationTriangle className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-semibold text-NEUTRAL-100">Delete Inventory</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100"
            aria-label="Close delete inventory modal"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm leading-6 text-GREY-200">
          This action will permanently remove
          <span className="mx-1 font-semibold text-NEUTRAL-100">{item?.name ?? 'this inventory item'}</span>
          and cannot be undone.
        </p>

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
            onClick={handleDelete}
            className="rounded-lg bg-RED-300 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {deleteLoading ? 'Deleting...' : 'Delete Item'}
          </button>
        </div>
      </div>
    </ModalPop>
  )
}


export default DeleteInventory