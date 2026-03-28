import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

interface Vehicle {
  id: string
  plateNumber: string
  make: string
  model: string
  year: number
  color: string
  owner: string
  ownerPhone: string
}

const mockVehicles: Vehicle[] = [
  { id: 'V001', plateNumber: 'LAG-234-AB', make: 'Toyota', model: 'Camry', year: 2020, color: 'Silver', owner: 'Chukwuemeka Obi', ownerPhone: '+234 801 234 5678' },
  { id: 'V002', plateNumber: 'ABJ-567-CD', make: 'Honda', model: 'Accord', year: 2019, color: 'Black', owner: 'Aisha Mohammed', ownerPhone: '+234 802 345 6789' },
  { id: 'V003', plateNumber: 'LAG-890-EF', make: 'Mercedes', model: 'C300', year: 2021, color: 'White', owner: 'Oluwaseun Adeyemi', ownerPhone: '+234 803 456 7890' },
  { id: 'V004', plateNumber: 'KAN-123-GH', make: 'Toyota', model: 'Hilux', year: 2022, color: 'Red', owner: 'Fatima Bello', ownerPhone: '+234 804 567 8901' },
  { id: 'V005', plateNumber: 'LAG-456-IJ', make: 'Hyundai', model: 'Tucson', year: 2020, color: 'Blue', owner: 'Damilola Ogundimu', ownerPhone: '+234 805 678 9012' },
  { id: 'V006', plateNumber: 'ABJ-789-KL', make: 'Ford', model: 'Explorer', year: 2018, color: 'Black', owner: 'Ibrahim Yusuf', ownerPhone: '+234 806 789 0123' },
  { id: 'V007', plateNumber: 'LAG-012-MN', make: 'Lexus', model: 'RX350', year: 2021, color: 'Pearl', owner: 'Ngozi Eze', ownerPhone: '+234 807 890 1234' },
  { id: 'V008', plateNumber: 'OYO-345-OP', make: 'Kia', model: 'Sportage', year: 2019, color: 'Grey', owner: 'Tunde Bakare', ownerPhone: '+234 808 901 2345' },
  { id: 'V009', plateNumber: 'LAG-678-QR', make: 'BMW', model: '3 Series', year: 2022, color: 'White', owner: 'Amaka Okafor', ownerPhone: '+234 809 012 3456' },
  { id: 'V010', plateNumber: 'ABJ-901-ST', make: 'Nissan', model: 'Pathfinder', year: 2020, color: 'Silver', owner: 'Emeka Nwosu', ownerPhone: '+234 810 123 4567' },
  { id: 'V011', plateNumber: 'LAG-234-UV', make: 'Toyota', model: 'Corolla', year: 2017, color: 'Blue', owner: 'Chioma Obi', ownerPhone: '+234 811 234 5678' },
  { id: 'V012', plateNumber: 'KAN-567-WX', make: 'Honda', model: 'CR-V', year: 2021, color: 'Red', owner: 'Musa Aliyu', ownerPhone: '+234 812 345 6789' },
]

const Vehicles = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = mockVehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.owner.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columns: Column<Vehicle>[] = [
    {
      key: 'plateNumber',
      header: 'Plate Number',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.plateNumber}</span>,
    },
    {
      key: 'make',
      header: 'Make',
      render: (item) => <span className="text-NEUTRAL-100">{item.make}</span>,
    },
    {
      key: 'model',
      header: 'Model',
      render: (item) => <span className="text-NEUTRAL-100">{item.model}</span>,
    },
    {
      key: 'year',
      header: 'Year',
      render: (item) => <span className="text-NEUTRAL-100">{item.year}</span>,
    },
    {
      key: 'color',
      header: 'Color',
      render: (item) => <span className="text-NEUTRAL-100">{item.color}</span>,
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (item) => <span className="text-NEUTRAL-100">{item.owner}</span>,
    },
    {
      key: 'ownerPhone',
      header: 'Owner Phone',
      render: (item) => <span className="text-NEUTRAL-100">{item.ownerPhone}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Plate Number', 'Make', 'Model', 'Year', 'Color', 'Owner', 'Owner Phone']
    const rows = filtered.map((v) => [v.plateNumber, v.make, v.model, v.year, v.color, v.owner, v.ownerPhone])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vehicles.csv'
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
            placeholder="Search by plate, make, model, or owner..."
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
          emptyMessage="No vehicles found"
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
                    Edit Vehicle
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => setOpenMenuId(null)}
                  >
                    Remove
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

export default Vehicles
