import { useEffect, useMemo, useState, useCallback } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye, HiOutlineFunnel, HiOutlineCube, HiOutlineClipboard, HiOutlineCurrencyDollar } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import type { InventoryItem, InventoryData, InventoryPayload, VendorOption, InventoryStatsData } from '../../types/global'
import InventoryFormModal from './components/InventoryFormModal'
import DeleteInventory from './components/DeleteInventory'
import ViewProductInventoryDetails from './components/ViewProductInventoryDetails'
import { inventoryApi, type InventoryFilters } from '../../services/inventory'
import { toast } from 'sonner'
import { SummaryCard } from './components/SummaryCard'
import { formatCurrency } from '../../helper'



type StockStatus = 'healthy' | 'low_stock' | 'out_of_stock' | 'medium'

const statusStyles: Record<StockStatus, string> = {
  healthy: 'bg-green-100 text-green-700',
  low_stock: 'bg-orange-100 text-orange-600',
  out_of_stock: 'bg-red-100 text-red-300',
  medium: 'bg-blue-100 text-blue-600',
}

const Inventory = () => {
  const [search, setSearch] = useState('')
  const [stockStatusFilter, setStockStatusFilter] = useState<'healthy' | 'low_stock' | 'out_of_stock' | 'medium' | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryData | null>(null)

  // API state
  const [inventory, setInventory] = useState<InventoryData[]>([])
  const [inventoryStats, setInventoryStats] = useState<InventoryStatsData | null>(null)
  const [categories, setCategories] = useState<VendorOption[]>([])
  const [vendors, setVendors] = useState<VendorOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch inventory from API
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: InventoryFilters = {
        search: search || undefined,
        stock_status: stockStatusFilter || undefined,
        per_page: itemsPerPage,
        page: currentPage,
      }

      const response = await inventoryApi.getInventory(filters)
      setInventory(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory')
      setInventory([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, stockStatusFilter, currentPage, itemsPerPage])

  // Fetch inventory stats
  const fetchInventoryStats = useCallback(async () => {
    try {
      const response = await inventoryApi.getInventoryStats()
      setInventoryStats(response)
    } catch (err) {
      console.error('Failed to fetch inventory stats:', err)
      setInventoryStats(null)
    }
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  useEffect(() => {
    fetchInventoryStats()
  }, [fetchInventoryStats])

  // Fetch reference data (categories and vendors)
  const fetchReferenceData = useCallback(async () => {
    try {
      const refData = await inventoryApi.getReferenceData()
      setCategories(refData.categories)
      setVendors(refData.vendors)
    } catch (err) {
      console.error('Failed to fetch reference data:', err)
    }
  }, [])

  useEffect(() => {
    fetchReferenceData()
  }, [fetchReferenceData])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, stockStatusFilter])

  // Transform API data for table display
    const transformedInventory: InventoryItem[] = useMemo(() => {
      return inventory.map((item) => ({
        id: item.id,
        sku: item.sku,
        productName: item.name,
        category: item.category.name,
        is_deleted: item.is_deleted,
        categoryId: item.category.id,
        vendorId: item.vendor.id,
        vendorName: item.vendor.name,
        unitPrice: parseFloat(item.price),
        quantity: parseInt(item.stock_quantity, 10),
        stockStatus: item.stock_status as 'healthy' | 'low_stock' | 'out_of_stock' | 'medium',
      }))
    }, [inventory])

    const filtered = useMemo(() => {
      const query = search.toLowerCase().trim()
      if (!query) {
        return transformedInventory
      }

      return transformedInventory.filter((item) => {
        return (
          item.productName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.vendorName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        )
      })
    }, [transformedInventory, search])

   const paginated = filtered.filter((item) => item.is_deleted === false).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const openEdit = (item: InventoryItem) => {
      // Find the original InventoryData item for the modal
      const originalItem = inventory.find((i) => i.id === item.id) || null
      setSelectedItem(originalItem)
      setIsEditOpen(true)
    }

    const openView = (item: InventoryItem) => {
      const originalItem = inventory.find((i) => i.id === item.id) || null
      setSelectedItem(originalItem)
      setIsViewOpen(true)
    }

    const openDelete = (item: InventoryItem) => {
      const originalItem = inventory.find((i) => i.id === item.id) || null
      setSelectedItem(originalItem)
      setIsDeleteOpen(true)
    }

    const closeEdit = () => {
      setIsEditOpen(false)
      setSelectedItem(null)
    }

    const closeView = () => {
      setIsViewOpen(false)
      setSelectedItem(null)
    }

    const closeDelete = () => {
      setIsDeleteOpen(false)
      setSelectedItem(null)
    }

    const handleAdd = async (payload: InventoryPayload) => {
      try {
        await inventoryApi.createInventoryItem(payload)
        toast.success('Inventory item added successfully')
        await fetchInventory()
      } catch (err: any) {
        toast.error(`${err.message}`)
        console.error('Failed to add inventory item:', err)
      }
    }

    const handleEdit = async (payload: InventoryPayload) => {
      if (!selectedItem) return
      try {
        await inventoryApi.updateInventory(selectedItem.id, payload)
        toast.success('Inventory item updated successfully')
        await fetchInventory()
        setSelectedItem(null)
      } catch (err) {
        console.error('Failed to update inventory item:', err)
      }
    }

    const handleDelete = async (itemId: string) => {
      setDeleteLoading(true)
      try {
        await inventoryApi.deleteInventoryItem(itemId)
        toast.success('Inventory item deleted successfully')
        await fetchInventory()
        setSelectedItem(null)
      } catch (err) {
        toast.error('Failed to delete inventory item')
        console.error('Failed to delete inventory item:', err)
      } finally {
        setDeleteLoading(false)
      }
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
          const stockStatus = item.stockStatus || (item.quantity <= 5 ? 'out_of_stock' : item.quantity <= 10 ? 'low_stock' : 'healthy')
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[stockStatus]}`}>
              {item.stockStatus ? stockStatus.replace('_', ' ').toUpperCase() : (stockStatus === 'out_of_stock' ? 'OUT OF STOCK' : stockStatus === 'low_stock' ? 'LOW STOCK' : 'HEALTHY')}
            </span>
          )
        },
      },
    ]

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product', 'Category', 'Vendor', 'Unit Price', 'Quantity', 'Stock Status']
    const rows = filtered.map((item) => {
      const stockStatus = item.quantity <= 5 ? 'OUT OF STOCK' : item.quantity <= 10 ? 'LOW STOCK' : 'HEALTHY'
      return [
        item.sku,
        item.productName,
        item.category,
        item.vendorName,
        item.unitPrice,
        item.quantity,
        stockStatus,
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

  // Compute stats values
  const totalProducts = inventoryStats?.total_products || 0
  const totalStock = inventoryStats?.total_stock || 0
  const inventoryValue = inventoryStats?.inventory_value || 0

  return (
    <div className="font-sans space-y-8">
      {/* ── Summary Cards ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SummaryCard
          label="Total Products"
          value={totalProducts}
          dark
          icon={
            <HiOutlineCube className="w-5 h-5 text-white/80" />
          }
        />
        <SummaryCard
          label="Total Stock"
          value={totalStock}
          icon={
            <HiOutlineClipboard className="w-5 h-5 text-GREY-200" />
          }
        />
        <SummaryCard
          label="Inventory Value"
          value={formatCurrency(inventoryValue)}
          icon={
            <HiOutlineCurrencyDollar className="w-5 h-5 text-GREY-200" />
          }
        />
      </div>
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

      {/* Filter Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative">
          <HiOutlineFunnel className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-GREY-200" />
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value as 'healthy' | 'low_stock' | 'out_of_stock' | '')}
            className="pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
          >
            <option value="">All Stock Status</option>
            <option value="healthy">Healthy</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-GREY-100 bg-white">
        <Table
          columns={columns}
          data={paginated}
          emptyMessage={loading ? "Loading inventory..." : error ? "Error loading inventory" : "No inventory items found"}
          renderActions={(item) => (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openView(item)
                }}
                className="rounded-md p-1.5 text-GREY-200 transition-colors hover:bg-GREY-300 hover:text-NEUTRAL-100"
                 aria-label={`View ${item.productName}`}
               >
                 <HiOutlineEye className="h-4 w-4" />
               </button>
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
        categoryList={categories}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />

      <InventoryFormModal
        isOpen={isEditOpen}
        title="Edit Inventory"
        submitLabel="Save Changes"
        vendorsList={vendors}
        categoryList={categories}
        initialValue={selectedItem}
        onClose={closeEdit}
        onSubmit={handleEdit}
      />

      <DeleteInventory 
        isOpen={isDeleteOpen} 
        item={selectedItem}  
        onClose={closeDelete} 
        onDelete={handleDelete} 
        deleteLoading={deleteLoading} 
      />

      <ViewProductInventoryDetails
        isOpen={isViewOpen}
        handleClose={closeView}
        item={selectedItem}
      />
    </div>
  )
}

export default Inventory