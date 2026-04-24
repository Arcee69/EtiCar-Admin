import { useState, useEffect, useCallback } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlineEllipsisVertical,
  HiOutlineFunnel,
} from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { ModalPop } from '../../components'
import ViewProviderDetails from './components/ViewProviderDetails'
import UpdateProvider from './components/UpdateProvider'
import VerifyProvider from './components/VerifyProvider'
import DeactivateProvider from './components/DeactivateProvider'
import { providersApi, type ProvidersFilters } from '../../services/providers'
import type { ProvidersData } from '../../types/global'

type ProviderStatus = 'pending' | 'verified' | 'declined' | ''

const statusStyles: Record<ProviderStatus, string> = {
  pending: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  verified: 'bg-green-400/15 text-green-400 border-green-400/30',
  declined: 'bg-red-400/15 text-red-400 border-red-400/30',
  '': 'bg-gray-100 text-gray-600 border-gray-200',
}

const Providers = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProviderStatus>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // Modal states
  const [selectedProvider, setSelectedProvider] = useState<ProvidersData | null>(null)
  const [openDeactivateProviderModal, setOpenDeactivateProviderModal] = useState(false)
  const [openProviderDetailsModal, setOpenProviderDetailsModal] = useState(false)
  const [openVerificationModal, setOpenVerificationModal] = useState(false)
  const [openEditProviderModal, setOpenEditProviderModal] = useState(false)

  // API state
  const [providers, setProviders] = useState<ProvidersData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch providers from API
  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: ProvidersFilters = {
        search: search || undefined,
        status: statusFilter || undefined,
        per_page: itemsPerPage,
        page: currentPage,
      }

      const response = await providersApi.getProviders(filters)
      setProviders(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch providers')
      setProviders([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, currentPage, itemsPerPage])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }

  const columns: Column<ProvidersData>[] = [
    {
      key: 'business_name',
      header: 'Name',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.business_name}</span>,
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
      key: 'active_jobs',
      header: 'Active Jobs',
      render: (item) => <span className="text-NEUTRAL-100">{item.active_jobs}</span>,
    },
    {
      key: 'completed_jobs',
      header: 'Completed',
      render: (item) => <span className="text-NEUTRAL-100">{item.completed_jobs}</span>,
    },
    {
      key: 'wallet_balance',
      header: 'Wallet',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.wallet_balance_formatted}</span>,
    },
    {
      key: 'verification_status',
      header: 'Verification',
      render: (item) => {
        const statusKey = (item.verification_status || '').toLowerCase() as ProviderStatus
        return (
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[statusKey] || statusStyles['']}`}>
            {item.verification_status_label || item.verification_status}
          </span>
        )
      },
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Services', 'City', 'Active Jobs', 'Completed', 'Wallet', 'Verification']
    const rows = providers.map((p) => [
      p.business_name,
      p.phone,
      p.services.join(' | '),
      p.city,
      p.active_jobs,
      p.completed_jobs,
      p.wallet_balance_formatted,
      p.verification_status
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'providers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleVerify = async (id: string, status: 'Verified' | 'Declined') => {
    try {
      await providersApi.verifyProvider(id, { verification_status: status })
      fetchProviders()
    } catch (err) {
      console.error('Failed to verify provider:', err)
    }
  }

  const handleDeactivate = async (id: string) => { //, reason: string
    try {
      await providersApi.deactivateProvider(id) //, reason
      fetchProviders()
    } catch (err) {
      console.error('Failed to deactivate provider:', err)
    }
  }

  const handleUpdate = async () => {
    fetchProviders()
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Status Filter */}
        <div className="relative">
          <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-GREY-200" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProviderStatus)}
            className="pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={providers}
          emptyMessage={loading ? "Loading providers..." : error ? "Error loading providers" : "No providers found"}
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
                      setOpenProviderDetailsModal(true)
                      setSelectedProvider(item)
                    }}
                  >
                    View Details
                  </button>
                  {item.can_verify !== false && (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setOpenVerificationModal(true)
                        setSelectedProvider(item)
                      }}
                    >
                      Verify Provider
                    </button>
                  )}
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setOpenMenuId(null)
                      setOpenEditProviderModal(true)
                      setSelectedProvider(item)
                    }}
                  >
                    Edit Provider
                  </button>
                  {item.can_deactivate !== false && (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setOpenMenuId(null)
                        setOpenDeactivateProviderModal(true)
                        setSelectedProvider(item)
                      }}
                    >
                      Deactivate
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

      <ModalPop isOpen={openProviderDetailsModal}>
        <ViewProviderDetails
          selectedProvider={selectedProvider}
          handleClose={() => setOpenProviderDetailsModal(false)}
          statusClassMap={statusStyles}
        />
      </ModalPop>
      <ModalPop isOpen={openVerificationModal}>
        <VerifyProvider
          selectedProvider={selectedProvider}
          handleClose={() => setOpenVerificationModal(false)}
          onConfirm={(status) => {
            if (selectedProvider) {
              handleVerify(selectedProvider.id, status)
              setOpenVerificationModal(false)
            }
          }}
        />
      </ModalPop>
      <ModalPop isOpen={openEditProviderModal}>
        <UpdateProvider
          selectedProvider={selectedProvider}
          handleClose={() => setOpenEditProviderModal(false)}
          onUpdate={handleUpdate}
        />
      </ModalPop>
      <ModalPop isOpen={openDeactivateProviderModal}>
        <DeactivateProvider
          selectedProvider={selectedProvider}
          handleClose={() => setOpenDeactivateProviderModal(false)}
          onConfirm={() => { //reason
            if (selectedProvider) {
              handleDeactivate(selectedProvider.id) //, reason
              setOpenDeactivateProviderModal(false)
            }
          }}
        />
      </ModalPop>
    </div>
  )
}

export default Providers
