import { useEffect, useMemo, useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash} from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import type { InventoryItem, InventoryPayload, VendorOption } from '../../types/global'
import InventoryFormModal from './components/InventoryFormModal'
import DeleteInventory from './components/DeleteInventory'


const vendors: VendorOption[] = [
  { id: 'VN001', name: 'Amara Parts' },
  { id: 'VN002', name: 'Northern Auto Supply' },
  { id: 'VN003', name: 'Capital Spares' },
  { id: 'VN004', name: 'Delta Auto World' },
  { id: 'VN005', name: 'Eastern Motors Parts' },
  { id: 'VN006', name: 'Ibadan Auto Mart' },
  { id: 'VN007', name: 'PH Spares Hub' },
  { id: 'VN008', name: 'Kaduna Motors' },
]

const initialInventory: InventoryItem[] = [
  {
    id: 'INV001',
    sku: 'BRK-TY-001',
    productName: 'Brake Pads (Toyota)',
    category: 'Braking System',
    vendorId: 'VN001',
    vendorName: 'Amara Parts',
    unitPrice: 18500,
    quantity: 42
  },
  {
    id: 'INV002',
    sku: 'AIR-HN-004',
    productName: 'Air Filter (Honda)',
    category: 'Engine Components',
    vendorId: 'VN003',
    vendorName: 'Capital Spares',
    unitPrice: 6200,
    quantity: 17
  },
  {
    id: 'INV003',
    sku: 'OIL-KI-003',
    productName: 'Oil Filter (Kia)',
    category: 'Engine Components',
    vendorId: 'VN005',
    vendorName: 'Eastern Motors Parts',
    unitPrice: 4800,
    quantity: 7
  },
  {
    id: 'INV004',
    sku: 'WIP-HY-002',
    productName: 'Wiper Blades (Hyundai)',
    category: 'Exterior',
    vendorId: 'VN002',
    vendorName: 'Northern Auto Supply',
    unitPrice: 7500,
    quantity: 29
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
}

const getStockPill = (item: InventoryItem) => {
  if (item.quantity <= 5) {
    return {
      label: 'Low Stock',
      className: 'bg-red-100 text-RED-300',
    }
  }

  if (item.quantity <= 5 * 2) {
    return {
      label: 'Medium',
      className: 'bg-orange-100 text-orange-600',
    }
  }

  return {
    label: 'Healthy',
    className: 'bg-green-100 text-green-700',
  }
}




const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) {
      return inventory
    }

    return inventory.filter((item) => {
      return (
        item.productName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.vendorName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    })
  }, [inventory, search])

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, itemsPerPage, totalItems])

  const getVendorNameById = (vendorId: string) => {
    return vendors.find((vendor) => vendor.id === vendorId)?.name ?? 'Unknown Vendor'
  }

  const handleAdd = (payload: InventoryPayload) => {
    setInventory((prev) => [
      ...prev,
      {
        id: `INV${String(prev.length + 1).padStart(3, '0')}`,
        ...payload,
        vendorName: getVendorNameById(payload.vendorId),
      },
    ])
  }

  const handleEdit = (payload: InventoryPayload) => {
    if (!selectedItem) {
      return
    }

    setInventory((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              ...payload,
              vendorName: getVendorNameById(payload.vendorId),
            }
          : item
      )
    )
    setSelectedItem(null)
  }

  const handleDelete = (itemId: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedItem(null)
  }

  const openEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const openDelete = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
    setSelectedItem(null)
  }

  const closeDelete = () => {
    setIsDeleteOpen(false)
    setSelectedItem(null)
  }

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.sku}</span>,
    },
    {
      key: 'productName',
      header: 'Product',
      render: (item) => <span className="text-NEUTRAL-100">{item.productName}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => <span className="text-NEUTRAL-100">{item.category}</span>,
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      render: (item) => <span className="text-NEUTRAL-100">{item.vendorName}</span>,
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (item) => <span className="text-NEUTRAL-100">{formatCurrency(item.unitPrice)}</span>,
    },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item) => <span className="text-NEUTRAL-100">{item.quantity}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item) => {
        const stock = getStockPill(item)
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stock.className}`}>
            {stock.label}
          </span>
        )
      },
    },
  ]

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product', 'Category', 'Vendor', 'Unit Price', 'Quantity', 'Reorder Level', 'Stock Status']
    const rows = filtered.map((item) => {
      const stock = getStockPill(item)
      return [
        item.sku,
        item.productName,
        item.category,
        item.vendorName,
        item.unitPrice,
        item.quantity,
        stock.label,
      ]
    })
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="font-sans">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-GREY-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by product, SKU, category, or vendor..."
            className="w-full rounded-lg border border-GREY-100 bg-white py-2.5 pl-10 pr-4 text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-BLUE-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 rounded-lg border border-GREY-100 bg-white px-4 py-2.5 text-sm font-medium text-NEUTRAL-100 transition-colors hover:bg-GREY-300"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-BLUE-100 px-4 py-2.5 text-sm font-medium text-white hover:bg-BLUE-300"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Inventory
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-GREY-100 bg-white">
        <Table
          columns={columns}
          data={paginated}
          emptyMessage="No inventory items found"
          renderActions={(item) => (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openEdit(item)
                }}
                className="rounded-md p-1.5 text-GREY-200 transition-colors hover:bg-GREY-300 hover:text-NEUTRAL-100"
                aria-label={`Edit ${item.productName}`}
              >
                <HiOutlinePencilSquare className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openDelete(item)
                }}
                className="rounded-md p-1.5 text-GREY-200 transition-colors hover:bg-GREY-300 hover:text-RED-300"
                aria-label={`Delete ${item.productName}`}
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          )}
        />

        <div className="border-t border-GREY-100 px-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <InventoryFormModal
        isOpen={isAddOpen}
        title="Add Inventory"
        submitLabel="Add Item"
        vendorsList={vendors}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />

      <InventoryFormModal
        isOpen={isEditOpen}
        title="Edit Inventory"
        submitLabel="Save Changes"
        vendorsList={vendors}
        initialValue={selectedItem}
        onClose={closeEdit}
        onSubmit={handleEdit}
      />

      <DeleteInventory isOpen={isDeleteOpen} item={selectedItem} onClose={closeDelete} onDelete={handleDelete} />
    </div>
  )
}

export default Inventory
