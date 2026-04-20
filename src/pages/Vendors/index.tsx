import { useState, useEffect, useCallback } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical, HiOutlineFunnel } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { ModalPop } from '../../components'
import UpdateVendor from './components/UpdateVendor'
import { vendorApi, type VendorFilters } from '../../services/vendors'
import type { Vendor } from '../../types/global'
import UpdateVendorStatus from './components/UpdateVendorStatus'
import VendorDetails from './components/VendorDetails'

type VendorStatus = 'active' | 'pending' | 'suspended'

// Using Vendor type from global types

const statusStyles: Record<VendorStatus, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-orange-100 text-orange-600',
  suspended: 'bg-red-100 text-red-300',
}

const Vendors = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'active' | 'pending' | 'suspended' | ''>('')
  const [locationFilter, setLocationFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null)
  const [openUpdateVendor, setOpenUpdateVendor] = useState<boolean>(false)
  const [openUpdateVendorStatus, setOpenUpdateVendorStatus] = useState<boolean>(false)
  const [openVendorDetails, setOpenVendorDetails] = useState<boolean>(false)

  // API state
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch vendors from API
  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: VendorFilters = {
        search: search || undefined,
        status: statusFilter || undefined,
        location: locationFilter || undefined,
        per_page: itemsPerPage,

      }

      const response = await vendorApi.getVendors(filters)
      setVendors(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors')
      setVendors([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, locationFilter, currentPage, itemsPerPage])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, locationFilter])

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }



  const columns: Column<Vendor>[] = [
    {
      key: 'vendor',
      header: 'Vendor',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.vendor_name}</span>,
    },
    {
      key: 'businessName',
      header: 'Business Name',
      render: (item) => <span className="text-NEUTRAL-100">{item.business_name}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (item) => <span className="text-NEUTRAL-100">{`${item.location.city}, ${item.location.state}`}</span>,
    },
    {
      key: 'products',
      header: 'Products',
      render: (item) => <span className="text-NEUTRAL-100">{item.products_count}</span>,
    },
    {
      key: 'ordersFulfilled',
      header: 'Orders Fulfilled',
      render: (item) => <span className="text-NEUTRAL-100">{item.orders_fulfilled}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 capitalize rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Vendor', 'Business Name', 'Location', 'Products', 'Orders Fulfilled', 'Status']
    const rows = vendors.map((v) => [v.vendor_name, v.business_name, v.location, v.products_count, v.orders_fulfilled, v.status])
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
      <div className="space-y-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vendor name or business name..."
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="relative">
            <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-GREY-200" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'active' | 'pending' | 'suspended' | '')}
              className="pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="relative flex-1 sm:max-w-xs">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-GREY-200" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location..."
              className="w-full pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={vendors}
          emptyMessage={loading ? "Loading vendors..." : error ? "Error loading vendors" : "No vendors found"}
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
                      setOpenVendorDetails(true)
                      setVendorDetails(item)
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setOpenMenuId(null)
                      setOpenUpdateVendor(true)
                      setVendorDetails(item)
                    }}
                  >
                    Edit Vendor
                  </button>
                  {item.status === 'suspended' ? (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-green-500 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setOpenUpdateVendorStatus(true)
                        setVendorDetails(item)
                      }}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setOpenUpdateVendorStatus(true)
                        setVendorDetails(item)
                      }}
                    >
                      Suspend
                    </button>
                  )}
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
            onItemsPerPageChange={handleItemsPerPageChange}
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

      <ModalPop isOpen={openUpdateVendor}>
        <UpdateVendor
          handleClose={() => setOpenUpdateVendor(false)}
          vendorDetails={vendorDetails}
          onUpdate={fetchVendors}
        />
      </ModalPop>

      <ModalPop isOpen={openUpdateVendorStatus}>
        <UpdateVendorStatus
          handleClose={() => setOpenUpdateVendorStatus(false)}
          vendorDetails={vendorDetails}
          onUpdate={fetchVendors}
        />
      </ModalPop>

      <ModalPop isOpen={openVendorDetails}>
        <VendorDetails
          handleClose={() => setOpenVendorDetails(false)}
          vendorDetails={vendorDetails}
        />
      </ModalPop>

    </div>
  )
}

export default Vendors
