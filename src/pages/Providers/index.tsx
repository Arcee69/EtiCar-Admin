import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

interface Provider {
  id: string
  name: string
  phone: string
  services: string[]
  city: string
  activeJobs: number
  completed: number
  wallet: string
}

const mockProviders: Provider[] = [
  { id: 'P001', name: 'AutoFix Lagos', phone: '+234 810 111 2222', services: ['Mechanic', 'Electrical'], city: 'Lagos', activeJobs: 3, completed: 87, wallet: '₦245,000' },
  { id: 'P002', name: 'QuickTyre Services', phone: '+234 810 222 3333', services: ['Tyre Change', 'Wheel Alignment'], city: 'Lagos', activeJobs: 1, completed: 45, wallet: '₦120,500' },
  { id: 'P003', name: 'AbujaMech Pro', phone: '+234 810 333 4444', services: ['Mechanic', 'Oil Change'], city: 'Abuja', activeJobs: 2, completed: 62, wallet: '₦180,000' },
  { id: 'P004', name: 'Kano Auto Care', phone: '+234 810 444 5555', services: ['Body Work', 'Painting'], city: 'Kano', activeJobs: 0, completed: 23, wallet: '₦67,500' },
  { id: 'P005', name: 'Ibadan Express Fix', phone: '+234 810 555 6666', services: ['AC Repair', 'Electrical'], city: 'Ibadan', activeJobs: 4, completed: 110, wallet: '₦320,000' },
  { id: 'P006', name: 'Port Harcourt Motors', phone: '+234 810 666 7777', services: ['Mechanic', 'Tyre Change'], city: 'Port Harcourt', activeJobs: 2, completed: 78, wallet: '₦215,000' },
  { id: 'P007', name: 'Enugu Auto Hub', phone: '+234 810 777 8888', services: ['Oil Change', 'Brake Service'], city: 'Enugu', activeJobs: 1, completed: 34, wallet: '₦95,000' },
  { id: 'P008', name: 'Warri Speed Garage', phone: '+234 810 888 9999', services: ['Mechanic', 'Body Work'], city: 'Warri', activeJobs: 3, completed: 56, wallet: '₦158,000' },
  { id: 'P009', name: 'Benin Auto Works', phone: '+234 810 999 0000', services: ['Electrical', 'AC Repair'], city: 'Benin City', activeJobs: 0, completed: 41, wallet: '₦112,000' },
  { id: 'P010', name: 'Kaduna Fix It', phone: '+234 811 000 1111', services: ['Mechanic', 'Wheel Alignment'], city: 'Kaduna', activeJobs: 2, completed: 67, wallet: '₦189,500' },
]

const Providers = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.services.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<Provider>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.name}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (item) => <span className="text-NEUTRAL-100">{item.phone}</span>,
    },
    {
      key: 'services',
      header: 'Services',
      render: (item) => (
        <span className="text-NEUTRAL-100">{item.services.join(', ')}</span>
      ),
    },
    {
      key: 'city',
      header: 'City',
      render: (item) => <span className="text-NEUTRAL-100">{item.city}</span>,
    },
    {
      key: 'activeJobs',
      header: 'Active Jobs',
      render: (item) => <span className="text-NEUTRAL-100">{item.activeJobs}</span>,
    },
    {
      key: 'completed',
      header: 'Completed',
      render: (item) => <span className="text-NEUTRAL-100">{item.completed}</span>,
    },
    {
      key: 'wallet',
      header: 'Wallet',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.wallet}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Services', 'City', 'Active Jobs', 'Completed', 'Wallet']
    const rows = filtered.map((p) => [p.name, p.phone, p.services.join(' | '), p.city, p.activeJobs, p.completed, p.wallet])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'providers.csv'
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
            placeholder="Search by name, city, or service..."
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
          emptyMessage="No providers found"
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
                    Edit Provider
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Deactivate
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

export default Providers
