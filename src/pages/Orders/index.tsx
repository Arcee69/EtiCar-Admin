import { useState, useEffect, useCallback } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { ModalPop } from '../../components'
import UpdateOrder from './components/UpdateOrder'
import OrderDetails from './components/OrderDetails'
import CancelOrder from './components/CancelOrder'
import type { Orders } from '../../types/global'
import { ordersApi } from '../../services/orders'

type OrderStatus = 'delivered' | 'pending' | 'shipped' | 'cancelled' | 'confirmed'

const statusStyles: Record<OrderStatus, string> = {
  'confirmed': 'bg-blue-100 text-BLUE-400',
  'shipped': 'bg-blue-50 text-BLUE-200',
  'pending': 'bg-orange-100 text-orange-600',
  'cancelled': 'bg-red-100 text-RED-300',
  'delivered': 'bg-green-100 text-GREEN-400',
}

const Orders = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openOrderDetails, setOpenOrderDetails] = useState(false)
  const [openUpdateOrder, setOpenUpdateOrder] = useState(false)
  const [openCancelOrder, setOpenCancelOrder] = useState(false)
   const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null)
   const [orders, setOrders] = useState<Orders[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const [totalItems, setTotalItems] = useState(0)

   //Fetch orders from API
   const fetchOrders = useCallback(async () => {
     try {
       setLoading(true)
       setError(null)

        const response = await ordersApi.getOrders({
          search: search || undefined,
          status: undefined,
          per_page: itemsPerPage,
          page: currentPage,
        })

       setOrders(response.data)
       setTotalItems(response.total)
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to fetch orders')
       setOrders([])
       setTotalItems(0)
     } finally {
       setLoading(false)
     }
   }, [search, currentPage, itemsPerPage])

   useEffect(() => {
     fetchOrders()
   }, [fetchOrders])

   // Reset to page 1 when filters change
   useEffect(() => {
     setCurrentPage(1)
   }, [search])

   const columns: Column<Orders>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.id.slice(0, 8)}</span>,
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (item) => <span className="text-NEUTRAL-100">{item.driver}</span>,
    },
    {
      key: 'vendor',
      header: 'Vendor',
      render: (item) => <span className="text-NEUTRAL-100">{item.vendor}</span>,
    },
    {
      key: 'product',
      header: 'Product',
      render: (item) => <span className="text-NEUTRAL-100">{item.product}</span>,
    },
    {
      key: 'quantity',
      header: 'Qty',
      render: (item) => <span className="text-NEUTRAL-100">{item.quantity}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 capitalize py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status as OrderStatus] ?? ''}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Driver', 'Vendor', 'Product', 'Qty', 'Status']
    const rows = orders.map((o) => [o.id, o.driver, o.vendor, o.product, o.quantity, o.status])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="font-sans">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by driver or vendor..."
            className="w-full pl-10 pr-4 py-2.5 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent bg-white"
          />
        </div>

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-GREY-100 rounded-lg text-sm font-medium text-NEUTRAL-100 bg-white hover:bg-GREY-300 transition-colors sm:shrink-0"
        >
          <HiOutlineArrowDownTray className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={orders}
          emptyMessage={loading ? "Loading orders..." : error ? "Error loading orders" : "No orders found"}
          renderActions={(item) => (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenMenuId(openMenuId === item.id ? null : item.id)
                }}
                className="p-1.5 rounded-lg text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100 transition-colors"
              >
                <HiOutlineEllipsisVertical className="w-5 h-5" />
              </button>

              {openMenuId === item.id && (
                <div
                  className="absolute right-0 top-8 bg-white border border-GREY-100 rounded-lg shadow-lg z-20 min-w-36 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setOpenMenuId(null)
                      setSelectedOrder(item)
                      setOpenOrderDetails(true)
                    }}
                  >
                    View Details
                  </button>
                  {
                    item.status !== 'cancelled' && item.status !== 'delivered' && (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setSelectedOrder(item)
                        setOpenUpdateOrder(true)
                      }}
                    >
                      Update Status
                    </button>
                    )
                  }
                  {
                    item.status !== 'cancelled' && item.status !== 'delivered' && (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setSelectedOrder(item)
                        setOpenCancelOrder(true)
                      }}
                    >
                      Cancel Order
                    </button>
                    )
                  }
                  
                </div>
              )}
            </div>
          )}
        />

        {/* Pagination */}
        <div className="px-4 border-t border-GREY-100">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1) }}
          />
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenuId(null)}
        />
      )}

      <ModalPop isOpen={openOrderDetails}>
        <OrderDetails 
          handleClose={() => setOpenOrderDetails(false)}
          orderDetails={selectedOrder}
        />
      </ModalPop>
      <ModalPop isOpen={openUpdateOrder}>
        <UpdateOrder 
          handleClose={() => setOpenUpdateOrder(false)}
          orderDetails={selectedOrder}
          onUpdate={fetchOrders}
        />
      </ModalPop>
      <ModalPop isOpen={openCancelOrder}>
        <CancelOrder 
          handleClose={() => setOpenCancelOrder(false)}
          orderDetails={selectedOrder}
          onUpdate={fetchOrders}
        />
      </ModalPop>
    </div>
  )
}

export default Orders
