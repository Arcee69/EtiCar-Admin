import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

interface User {
  id: string
  name: string
  phone: string
  email: string
  registered: string
  vehicles: number
}

const mockUsers: User[] = [
  { id: 'U001', name: 'Chukwuemeka Obi', phone: '+234 801 234 5678', email: 'chukwuemeka@email.com', registered: '2026-01-15', vehicles: 2 },
  { id: 'U002', name: 'Aisha Mohammed', phone: '+234 802 345 6789', email: 'aisha.m@email.com', registered: '2026-01-20', vehicles: 1 },
  { id: 'U003', name: 'Oluwaseun Adeyemi', phone: '+234 803 456 7890', email: 'seun.a@email.com', registered: '2026-02-01', vehicles: 3 },
  { id: 'U004', name: 'Fatima Bello', phone: '+234 804 567 8901', email: 'fatima.b@email.com', registered: '2026-02-10', vehicles: 1 },
  { id: 'U005', name: 'Damilola Ogundimu', phone: '+234 805 678 9012', email: 'damilola@email.com', registered: '2026-02-15', vehicles: 2 },
  { id: 'U006', name: 'Ibrahim Yusuf', phone: '+234 806 789 0123', email: 'ibrahim.y@email.com', registered: '2026-02-20', vehicles: 1 },
  { id: 'U007', name: 'Ngozi Eze', phone: '+234 807 890 1234', email: 'ngozi.e@email.com', registered: '2026-03-01', vehicles: 2 },
  { id: 'U008', name: 'Tunde Bakare', phone: '+234 808 901 2345', email: 'tunde.b@email.com', registered: '2026-03-05', vehicles: 1 },
  { id: 'U009', name: 'Amaka Okafor', phone: '+234 809 012 3456', email: 'amaka.o@email.com', registered: '2026-03-10', vehicles: 3 },
  { id: 'U010', name: 'Emeka Nwosu', phone: '+234 810 123 4567', email: 'emeka.n@email.com', registered: '2026-03-12', vehicles: 2 },
]

const Users = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.id}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      render: (item) => <span className="text-NEUTRAL-100">{item.name}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (item) => <span className="text-NEUTRAL-100">{item.phone}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => <span className="text-NEUTRAL-100">{item.email}</span>,
    },
    {
      key: 'registered',
      header: 'Registered',
      render: (item) => <span className="text-NEUTRAL-100">{item.registered}</span>,
    },
    {
      key: 'vehicles',
      header: 'Vehicles',
      render: (item) => <span className="text-NEUTRAL-100">{item.vehicles}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Registered', 'Vehicles']
    const rows = filtered.map((u) => [u.id, u.name, u.phone, u.email, u.registered, u.vehicles])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
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
            placeholder="Search by name, phone, or email..."
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
          emptyMessage="No users found"
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
                    Edit User
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

export default Users
