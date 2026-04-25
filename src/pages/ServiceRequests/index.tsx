import { useState, useEffect, useCallback } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical, HiOutlineFunnel } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { ModalPop } from '../../components'
import ViewServiceRequestDetails from './components/ViewServiceRequestDetails'
import CancelServiceRequestProvider from './components/CancelServiceRequestProvider'
import AssignServiceRequestProvider from './components/AssignServiceRequestProvider'
import { serviceRequestsApi, type ServiceRequestsFilters } from '../../services/serviceRequests'
import type { ServiceRequestData } from '../../types/global'
import UnAssignServiceRequestProvider from './components/UnAssignServiceRequestProvider'

type ServiceStatus = 'completed' | 'pending' | 'cancelled' | 'in_progress' | 'accepted'
type StatusFilter = 'completed' | 'pending' | 'cancelled' | 'in_progress' | 'accepted' | ''


const statusStyles: Record<ServiceStatus, string> = {
  'completed': 'bg-green-100 text-green-700',
  'pending': 'bg-orange-100 text-orange-600',
  'in_progress': 'bg-blue-100 text-blue-600',
  'cancelled': 'bg-red-100 text-red-700',
  'accepted': 'bg-purple-100 text-purple-700',
}

const ServiceRequests = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [openAssignModal, setOpenAssignModal] = useState(false)
  const [openUnassignModal, setOpenUnassignModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedServiceRequest, setSelectedServiceRequest] = useState<ServiceRequestData | null>(null)

  // API state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch service requests from API
  const fetchServiceRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: ServiceRequestsFilters = {
        search: search || undefined,
        status: statusFilter || undefined,
        per_page: itemsPerPage,
        page: currentPage,
      }

      const response = await serviceRequestsApi.getServiceRequests(filters)
      setServiceRequests(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch service requests')
      setServiceRequests([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, currentPage, itemsPerPage])

  useEffect(() => {
    fetchServiceRequests()
  }, [fetchServiceRequests])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const columns: Column<ServiceRequestData>[] = [
    {
      key: 'requestId',
      header: 'Request ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.request_id_short}</span>,
    },
    {
      key: 'driver',
      header: 'Driver',
      render: (item) => <span className="text-NEUTRAL-100">{item.driver}</span>,
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (item) => <span className="text-NEUTRAL-100">{item.vehicle}</span>,
    },
    {
      key: 'serviceType',
      header: 'Service Type',
      render: (item) => <span className="text-NEUTRAL-100">{item.service_type}</span>,
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (item) => (
        <span className={item.provider === 'Unassigned' ? 'text-GREY-200 italic' : 'text-NEUTRAL-100'}>
          {item.provider}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center capitalize px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status as ServiceStatus]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Request ID', 'Driver', 'Vehicle', 'Service Type', 'Provider', 'Status']
    const rows = serviceRequests.map((sr) => [sr.request_id_short, sr.driver, sr.vehicle, sr.service_type, sr.provider, sr.status])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'service-requests.csv'
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
              placeholder="Search by driver, service, or provider..."
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
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="in_progress">In Progress</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={serviceRequests}
          emptyMessage={loading ? "Loading service requests..." : error ? "Error loading service requests" : "No service requests found"}
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
                      setSelectedServiceRequest(item)
                      setOpenDetailsModal(true)
                      setOpenMenuId(null)
                    }}
                  >
                    View Details
                  </button>
                  {
                    item.status === 'completed' || item.status === 'cancelled' ? null :  
                    item.status ==='accepted' ? (
                       <button
                        className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                        onClick={() => {
                          setSelectedServiceRequest(item)
                          setOpenUnassignModal(true)
                          setOpenMenuId(null)
                        }}
                      >
                        UnAssign Provider
                      </button> ) : (
                      <button
                        className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                        onClick={() => {
                          setSelectedServiceRequest(item)
                          setOpenAssignModal(true)
                          setOpenMenuId(null)
                        }}
                      >
                        Assign Provider
                      </button>
                    )
                  }
                  {
                    item.status === 'completed' || item.status === 'cancelled' ? null :
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setSelectedServiceRequest(item)
                        setOpenCancelModal(true)
                        setOpenMenuId(null)
                      }}
                    >
                      Cancel Request
                    </button>
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

      <ModalPop isOpen={openDetailsModal}>
        <ViewServiceRequestDetails
          handleClose={() => setOpenDetailsModal(false)}
          serviceRequestDetails={selectedServiceRequest}
        />
      </ModalPop>
      <ModalPop isOpen={openAssignModal}>
        <AssignServiceRequestProvider
          handleClose={() => setOpenAssignModal(false)}
          serviceRequestDetails={selectedServiceRequest}
          onUpdate={fetchServiceRequests}
        />
      </ModalPop>
      <ModalPop isOpen={openUnassignModal}>
        <UnAssignServiceRequestProvider
          handleClose={() => setOpenUnassignModal(false)}
          serviceRequestDetails={selectedServiceRequest}
          onUpdate={fetchServiceRequests}
        />
      </ModalPop>
      <ModalPop isOpen={openCancelModal}>
        <CancelServiceRequestProvider
          handleClose={() => setOpenCancelModal(false)}
          serviceRequestDetails={selectedServiceRequest}
          onUpdate={fetchServiceRequests}
        />
      </ModalPop>

    </div>
  )
}

export default ServiceRequests
