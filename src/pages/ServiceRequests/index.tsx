import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

type ServiceStatus = 'In-Progress' | 'Pending' | 'Completed' | 'Cancelled'

interface ServiceRequest {
  id: string
  requestId: string
  driver: string
  vehicle: string
  serviceType: string
  provider: string
  status: ServiceStatus
}

const mockServiceRequests: ServiceRequest[] = [
  { id: 'SR001', requestId: 'SR001', driver: 'Chukwuemeka Obi', vehicle: 'Toyota Camry (LAG-234-AB)', serviceType: 'Oil Change', provider: 'AutoFix Lagos', status: 'In-Progress' },
  { id: 'SR002', requestId: 'SR002', driver: 'Aisha Mohammed', vehicle: 'Honda Accord (ABJ-567-CD)', serviceType: 'Tyre Change', provider: 'Unassigned', status: 'Pending' },
  { id: 'SR003', requestId: 'SR003', driver: 'Oluwaseun Adeyemi', vehicle: 'Mercedes C300 (LAG-890-EF)', serviceType: 'AC Repair', provider: 'Ibadan Express Fix', status: 'In-Progress' },
  { id: 'SR004', requestId: 'SR004', driver: 'Damilola Ogundimu', vehicle: 'Hyundai Tucson (LAG-456-IJ)', serviceType: 'Brake Service', provider: 'AutoFix Lagos', status: 'Completed' },
  { id: 'SR005', requestId: 'SR005', driver: 'Ibrahim Yusuf', vehicle: 'Ford Explorer (ABJ-789-KL)', serviceType: 'Electrical', provider: 'Benin Auto Works', status: 'Pending' },
  { id: 'SR006', requestId: 'SR006', driver: 'Ngozi Eze', vehicle: 'Lexus RX350 (LAG-012-MN)', serviceType: 'Wheel Alignment', provider: 'QuickTyre Services', status: 'Completed' },
  { id: 'SR007', requestId: 'SR007', driver: 'Tunde Bakare', vehicle: 'Kia Sportage (OYO-345-OP)', serviceType: 'Mechanic', provider: 'AbujaMech Pro', status: 'In-Progress' },
  { id: 'SR008', requestId: 'SR008', driver: 'Amaka Okafor', vehicle: 'BMW 3 Series (LAG-678-QR)', serviceType: 'Body Work', provider: 'Warri Speed Garage', status: 'Pending' },
  { id: 'SR009', requestId: 'SR009', driver: 'Emeka Nwosu', vehicle: 'Nissan Pathfinder (ABJ-901-ST)', serviceType: 'Oil Change', provider: 'Kano Auto Care', status: 'Completed' },
  { id: 'SR010', requestId: 'SR010', driver: 'Fatima Bello', vehicle: 'Toyota Hilux (KAN-123-GH)', serviceType: 'Painting', provider: 'Unassigned', status: 'Cancelled' },
  { id: 'SR011', requestId: 'SR011', driver: 'Chioma Obi', vehicle: 'Toyota Corolla (LAG-234-UV)', serviceType: 'AC Repair', provider: 'Port Harcourt Motors', status: 'In-Progress' },
  { id: 'SR012', requestId: 'SR012', driver: 'Musa Aliyu', vehicle: 'Honda CR-V (KAN-567-WX)', serviceType: 'Tyre Change', provider: 'QuickTyre Services', status: 'Completed' },
]

const statusStyles: Record<ServiceStatus, string> = {
  'In-Progress': 'bg-blue-100 text-BLUE-400',
  'Pending': 'bg-orange-100 text-orange-600',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-RED-300',
}

const ServiceRequests = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockServiceRequests.filter(
    (sr) =>
      sr.driver.toLowerCase().includes(search.toLowerCase()) ||
      sr.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      sr.provider.toLowerCase().includes(search.toLowerCase()) ||
      sr.requestId.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<ServiceRequest>[] = [
    {
      key: 'requestId',
      header: 'Request ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.requestId}</span>,
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
      render: (item) => <span className="text-NEUTRAL-100">{item.serviceType}</span>,
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Request ID', 'Driver', 'Vehicle', 'Service Type', 'Provider', 'Status']
    const rows = filtered.map((sr) => [sr.requestId, sr.driver, sr.vehicle, sr.serviceType, sr.provider, sr.status])
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={paginated}
          emptyMessage="No service requests found"
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
                    Assign Provider
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Cancel Request
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

export default ServiceRequests
