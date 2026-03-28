import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

type VendorStatus = 'Active' | 'Pending' | 'Suspended'

interface Vendor {
  id: string
  vendor: string
  businessName: string
  location: string
  products: number
  ordersFulfilled: number
  status: VendorStatus
}

const mockVendors: Vendor[] = [
  { id: 'VN001', vendor: 'Amara Parts', businessName: 'Amara Auto Parts Ltd', location: 'Lagos', products: 156, ordersFulfilled: 342, status: 'Active' },
  { id: 'VN002', vendor: 'Northern Auto Supply', businessName: 'Northern Auto Supply Co', location: 'Kano', products: 89, ordersFulfilled: 167, status: 'Active' },
  { id: 'VN003', vendor: 'Capital Spares', businessName: 'Capital Spares & Accessories', location: 'Abuja', products: 234, ordersFulfilled: 521, status: 'Active' },
  { id: 'VN004', vendor: 'Delta Auto World', businessName: 'Delta Auto World Ltd', location: 'Warri', products: 45, ordersFulfilled: 78, status: 'Pending' },
  { id: 'VN005', vendor: 'Eastern Motors Parts', businessName: 'Eastern Motors Parts Hub', location: 'Enugu', products: 112, ordersFulfilled: 203, status: 'Active' },
  { id: 'VN006', vendor: 'Ibadan Auto Mart', businessName: 'Ibadan Auto Mart Ltd', location: 'Ibadan', products: 67, ordersFulfilled: 134, status: 'Active' },
  { id: 'VN007', vendor: 'PH Spares Hub', businessName: 'Port Harcourt Spares Hub', location: 'Port Harcourt', products: 198, ordersFulfilled: 412, status: 'Active' },
  { id: 'VN008', vendor: 'Kaduna Motors', businessName: 'Kaduna Motors & Parts', location: 'Kaduna', products: 33, ordersFulfilled: 56, status: 'Suspended' },
  { id: 'VN009', vendor: 'Benin Auto Store', businessName: 'Benin Auto Store Ltd', location: 'Benin City', products: 78, ordersFulfilled: 145, status: 'Active' },
  { id: 'VN010', vendor: 'Aba Parts Depot', businessName: 'Aba Parts Depot Co', location: 'Aba', products: 145, ordersFulfilled: 289, status: 'Pending' },
]

const statusStyles: Record<VendorStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-orange-100 text-orange-600',
  Suspended: 'bg-red-100 text-RED-300',
}

const Vendors = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockVendors.filter(
    (v) =>
      v.vendor.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<Vendor>[] = [
    {
      key: 'vendor',
      header: 'Vendor',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.vendor}</span>,
    },
    {
      key: 'businessName',
      header: 'Business Name',
      render: (item) => <span className="text-NEUTRAL-100">{item.businessName}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (item) => <span className="text-NEUTRAL-100">{item.location}</span>,
    },
    {
      key: 'products',
      header: 'Products',
      render: (item) => <span className="text-NEUTRAL-100">{item.products}</span>,
    },
    {
      key: 'ordersFulfilled',
      header: 'Orders Fulfilled',
      render: (item) => <span className="text-NEUTRAL-100">{item.ordersFulfilled}</span>,
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
    const headers = ['Vendor', 'Business Name', 'Location', 'Products', 'Orders Fulfilled', 'Status']
    const rows = filtered.map((v) => [v.vendor, v.businessName, v.location, v.products, v.ordersFulfilled, v.status])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vendors.csv'
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
            placeholder="Search by vendor, business, or location..."
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
          emptyMessage="No vendors found"
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
                    Edit Vendor
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Suspend
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

export default Vendors
