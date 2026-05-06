import { useEffect, useState, useCallback, useMemo } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical, HiOutlineTruck, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle, HiOutlinePlus } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { vehiclesApi } from '../../services/vehicles'
import type { VehiclesData, VehiclesStatsData, VehiclesReferenceData } from '../../types/global'
import { ModalPop } from '../../components'
import CreateVehicle from './components/CreateVehicle'
import EditVehicle from './components/EditVehicle'
import DeleteVehicle from './components/DeleteVehicle'
import RestoreVehicle from './components/RestoreVehicle'
import ViewVehiclesDetails from './components/ViewVehiclesDetails'

type VehicleStatus = 'available' | 'on_trip' | 'under_review' | 'suspended'

// Using User type from global types

const statusStyles: Record<VehicleStatus, string> = {
  available: 'bg-green-100 text-green-700',
  on_trip: 'bg-blue-100 text-blue-400',
  under_review: 'bg-orange-100 text-orange-400',
  suspended: 'bg-red-100 text-red-400',
}

type StatVariant = 'navy' | 'teal' | 'orange' | 'white'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  variant?: StatVariant
  icon: React.ReactNode
}

const StatCard = ({ label, value, subtext, variant = 'white', icon }: StatCardProps) => {
  const styles: Record<StatVariant, { card: string; iconBg: string; text: string; sub: string }> = {
    navy:   { card: 'bg-NEUTRAL-300 border-NEUTRAL-200', iconBg: 'bg-white/10', text: 'text-white',       sub: 'text-white/70' },
    teal:   { card: 'bg-TEAL-100 border-TEAL-200',       iconBg: 'bg-white/15', text: 'text-white',       sub: 'text-white/70' },
    orange: { card: 'bg-ORANGE-100 border-ORANGE-200',   iconBg: 'bg-white/20', text: 'text-white',       sub: 'text-white/80' },
    white:  { card: 'bg-white border-GREY-100',          iconBg: 'bg-GREY-300', text: 'text-NEUTRAL-100', sub: 'text-GREY-200'  },
  }
  const s = styles[variant]

  return (
    <div className={`rounded-xl p-5 border ${s.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`text-sm mb-2 ${s.sub}`}>{label}</p>
          <p className={`text-3xl font-bold ${s.text}`}>{value}</p>
          {subtext && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${s.sub}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {subtext}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>
          <span className={s.text}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

const SkeletonStatCard = () => (
  <div className="flex-1 min-w-50 rounded-xl p-5 border border-GREY-100 bg-NEUTRAL-300/30">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-3">
        <div className="h-3 w-24 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-8 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-3 w-28 bg-NEUTRAL-200/50 rounded animate-pulse" />
      </div>
      <div className="w-10 h-10 rounded-lg bg-NEUTRAL-200/50 animate-pulse shrink-0" />
    </div>
  </div>
)

const transformVehiclesStatsForCards = (stats: VehiclesStatsData) => [
  {
    label: 'Total Vehicles',
    value: stats.total.toString(),
    variant: 'navy' as const,
    icon: <HiOutlineTruck className="w-5 h-5" />,
  },
  {
    label: 'Available',
    value: stats.available.toString(),
    variant: 'teal' as const,
    icon: <HiOutlineCheckCircle className="w-5 h-5" />,
  },
  {
    label: 'Under Review',
    value: stats.under_review.toString(),
    variant: 'orange' as const,
    icon: <HiOutlineClock className="w-5 h-5" />,
  },
  {
    label: 'Suspended',
    value: stats.suspended.toString(),
    variant: 'white' as const,
    icon: <HiOutlineExclamationCircle className="w-5 h-5 text-GREY-200" />,
  },
]


const Vehicles = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<VehiclesData[]>([])
  const [stats, setStats] = useState<VehiclesStatsData | null>(null)
  const [search, setSearch] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclesData | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [usersList, setUsersList] = useState<VehiclesReferenceData['users']>([])

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehiclesApi.getVehicles({ search: search || undefined, per_page: 10 })
      setVehicles(response.data)     
      setTotalItems(response.total)
    } catch (err: unknown) {
      console.error('Failed to fetch vehicles:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [search])

  const fetchVehiclesStats = useCallback(async () => {
    try {
      const response = await vehiclesApi.getVehiclesStats()
      setStats(response)
    } catch (err) {
      console.error('Failed to fetch vehicles stats:', err)
      setStats(null)
    }
  }, [])

  const fetchReferenceData = useCallback(async () => {
    try {
      const refData = await vehiclesApi.getReferenceData()
      setUsersList(refData.users)
    } catch (err) {
      console.error('Failed to fetch reference data:', err)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  useEffect(() => {
    fetchVehiclesStats()
  }, [fetchVehiclesStats])

  useEffect(() => {
    fetchReferenceData()
  }, [fetchReferenceData])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return vehicles
    return vehicles.filter(
      (v) =>
        v.plate_number.toLowerCase().includes(query) ||
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.owner_name.toLowerCase().includes(query)
    )
  }, [vehicles, search])

   useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const statCards = useMemo(() => stats ? transformVehiclesStatsForCards(stats) : [], [stats])

  const columns: Column<VehiclesData>[] = [
    {
      key: 'plateNumber',
      header: 'Plate Number',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.plate_number}</span>,
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
      render: (item) => <span className="text-NEUTRAL-100">{item.owner_name}</span>,
    },
    {
      key: 'ownerPhone',
      header: 'Owner Phone',
      render: (item) => <span className="text-NEUTRAL-100">{item.owner_phone}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const status = item.status as VehicleStatus
        return (
          <span className={`inline-flex items-center px-2.5 py-1 capitalize rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {item.status}
          </span>
        )
      },
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Plate Number', 'Make', 'Model', 'Year', 'Color', 'Owner', 'Owner Phone']
    const rows = filtered.map((v) => [v.plate_number, v.make, v.model, v.year, v.color, v.owner_name, v.owner.phone])
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
          : statCards.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))
        }
      </div>

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
        <div className='flex items-center gap-5'>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-BLUE-100 px-4 py-2.5 text-sm font-medium text-white hover:bg-BLUE-300"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add Vehicle
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-GREY-100 rounded-lg text-sm font-medium text-NEUTRAL-100 bg-white hover:bg-GREY-300 transition-colors sm:shrink-0"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Export CSV
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={vehicles}
          emptyMessage={loading ? "Loading vehicles..." : error ? "Error loading vehicles" : "No vehicles found"} 
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
                      setIsViewOpen(true)
                      setSelectedVehicle(item)
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setOpenMenuId(null)
                      setIsEditOpen(true)
                      setSelectedVehicle(item)
                    }}
                  >
                    Edit Vehicle
                  </button>
                  {
                    item.status === "suspended" &&
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setIsRestoreOpen(true)
                        setSelectedVehicle(item)
                      }}
                    >
                      Restore Vehicle
                    </button>
                  }
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setOpenMenuId(null)
                      setIsDeleteOpen(true)
                      setSelectedVehicle(item)
                    }}
                  >
                    Delete Vehicle
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

      <ModalPop isOpen={isViewOpen}>
        <ViewVehiclesDetails 
          handleClose={() => setIsViewOpen(false)}
          vehicleDetails={selectedVehicle}
        />
      </ModalPop>

      <ModalPop isOpen={isAddOpen}>
        <CreateVehicle 
          handleClose={() => setIsAddOpen(false)}
          onUpdate={fetchVehicles}
          usersList={usersList}
        />
      </ModalPop>

      <ModalPop isOpen={isEditOpen}>
        <EditVehicle
          handleClose={() => setIsEditOpen(false)}
          vehicleDetails={selectedVehicle}
          onUpdate={fetchVehicles}
          usersList={usersList}
        />
      </ModalPop>

      <ModalPop isOpen={isRestoreOpen}>
        <RestoreVehicle
          handleClose={() => setIsRestoreOpen(false)}
          vehicleDetails={selectedVehicle}
          onUpdate={fetchVehicles}
        />
      </ModalPop>

      <ModalPop isOpen={isDeleteOpen}>
        <DeleteVehicle 
          handleClose={() => setIsDeleteOpen(false)}
          vehicleDetails={selectedVehicle}
          onUpdate={fetchVehicles}
        />
      </ModalPop>

    </div>
  )
}

export default Vehicles
