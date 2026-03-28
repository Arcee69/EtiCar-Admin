import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

type OrderStatus = 'Completed' | 'In-Progress' | 'Pending' | 'Cancelled'

interface Order {
  id: string
  orderId: string
  driver: string
  vendor: string
  product: string
  qty: number
  status: OrderStatus
}

const mockOrders: Order[] = [
  { id: 'ORD001', orderId: 'ORD001', driver: 'Chukwuemeka Obi', vendor: 'Amara Parts', product: 'Brake Pads (Toyota)', qty: 2, status: 'Completed' },
  { id: 'ORD002', orderId: 'ORD002', driver: 'Aisha Mohammed', vendor: 'Capital Spares', product: 'Air Filter (Honda)', qty: 1, status: 'In-Progress' },
  { id: 'ORD003', orderId: 'ORD003', driver: 'Oluwaseun Adeyemi', vendor: 'Amara Parts', product: 'Headlight Assembly (Mercedes)', qty: 1, status: 'Pending' },
  { id: 'ORD004', orderId: 'ORD004', driver: 'Ngozi Eze', vendor: 'Eastern Motors Parts', product: 'Spark Plugs (Ford)', qty: 6, status: 'Completed' },
  { id: 'ORD005', orderId: 'ORD005', driver: 'Tunde Bakare', vendor: 'Capital Spares', product: 'Oil Filter (Kia)', qty: 1, status: 'Completed' },
  { id: 'ORD006', orderId: 'ORD006', driver: 'Damilola Ogundimu', vendor: 'Northern Auto Supply', product: 'Wiper Blades (Hyundai)', qty: 2, status: 'In-Progress' },
  { id: 'ORD007', orderId: 'ORD007', driver: 'Ibrahim Yusuf', vendor: 'PH Spares Hub', product: 'Battery (Ford)', qty: 1, status: 'Pending' },
  { id: 'ORD008', orderId: 'ORD008', driver: 'Amaka Okafor', vendor: 'Amara Parts', product: 'Shock Absorbers (BMW)', qty: 4, status: 'Completed' },
  { id: 'ORD009', orderId: 'ORD009', driver: 'Emeka Nwosu', vendor: 'Ibadan Auto Mart', product: 'Timing Belt (Nissan)', qty: 1, status: 'In-Progress' },
  { id: 'ORD010', orderId: 'ORD010', driver: 'Fatima Bello', vendor: 'Capital Spares', product: 'Radiator (Toyota)', qty: 1, status: 'Cancelled' },
  { id: 'ORD011', orderId: 'ORD011', driver: 'Chioma Obi', vendor: 'Northern Auto Supply', product: 'Clutch Kit (Toyota)', qty: 1, status: 'Completed' },
  { id: 'ORD012', orderId: 'ORD012', driver: 'Musa Aliyu', vendor: 'Eastern Motors Parts', product: 'Alternator (Honda)', qty: 1, status: 'Pending' },
]

const statusStyles: Record<OrderStatus, string> = {
  'Completed': 'bg-blue-100 text-BLUE-400',
  'In-Progress': 'bg-blue-50 text-BLUE-200',
  'Pending': 'bg-orange-100 text-orange-600',
  'Cancelled': 'bg-red-100 text-RED-300',
}

const Orders = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockOrders.filter(
    (o) =>
      o.driver.toLowerCase().includes(search.toLowerCase()) ||
      o.vendor.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<Order>[] = [
    {
      key: 'orderId',
      header: 'Order ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.orderId}</span>,
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
      key: 'qty',
      header: 'Qty',
      render: (item) => <span className="text-NEUTRAL-100">{item.qty}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Driver', 'Vendor', 'Product', 'Qty', 'Status']
    const rows = filtered.map((o) => [o.orderId, o.driver, o.vendor, o.product, o.qty, o.status])
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
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by driver, vendor, or product..."
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
          data={paginated}
          emptyMessage="No orders found"
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
                    onClick={() => setOpenMenuId(null)}
                  >
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Update Status
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Cancel Order
                  </button>
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
    </div>
  )
}

export default Orders
