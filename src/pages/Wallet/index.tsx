import { useCallback, useEffect, useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import type { WalletData, WalletStats } from '../../types/global'
import { walletApi, type WalletFilters } from '../../services/wallet'
import { ModalPop } from '../../components'
import UpdateWalletStatus from './components/UpdateWalletStatus'
import WalletDetails from './components/WalletDetails'
import { formatNaira } from '../../helper'

// ─── Types ────────────────────────────────────────────────────────────────────

type WalletStatus = 'active' | 'frozen' | 'pending'


// ─── Style Maps ───────────────────────────────────────────────────────────────

const walletStatusStyles: Record<WalletStatus, string> = {
  'active': 'bg-teal-50 text-teal-600 border border-teal-200',
  'frozen': 'bg-red-50 text-red-600 border border-red-200',
  'pending': 'bg-orange-50 text-orange-500 border border-orange-200',
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string
  value: string
  dark?: boolean
  icon?: React.ReactNode
  arrowUp?: boolean
  arrowDown?: boolean
}

const SummaryCard = ({ label, value, dark, icon, arrowUp, arrowDown }: SummaryCardProps) => (
  <div
    className={`flex-1 min-w-45 rounded-xl p-5 flex items-center justify-between gap-4 border ${dark
        ? 'bg-NEUTRAL-300 border-NEUTRAL-200 text-white'
        : 'bg-white border-GREY-100 text-NEUTRAL-100'
      }`}
  >
    <div>
      <p className={`text-sm mb-1 ${dark ? 'text-white/70' : 'text-GREY-200'}`}>{label}</p>
      <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-NEUTRAL-100'}`}>{value}</p>
    </div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${dark ? 'bg-white/10' : 'bg-GREY-300'
        }`}
    >
      {icon ?? (
        arrowUp ? (
          <svg className="w-5 h-5 text-GREY-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        ) : arrowDown ? (
          <svg className="w-5 h-5 text-GREY-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7L7 17M7 17h10M7 17V7" />
          </svg>
        ) : null
      )}
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const Wallet = () => {
  const [search, setSearch] = useState('')
  // const [statusFilter, setStatusFilter] = useState<'active' | 'pending' | 'suspended' | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openUpdateWalletStatus, setOpenUpdateWalletStatus] = useState(false)
  const [walletDetails, setWalletDetails] = useState<WalletData | null>(null)
  const [openWalletDetails, setOpenWalletDetails] = useState(false)
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null)


   // Fetch wallets from API
    const fetchWallets = useCallback(async () => {
      try {
        setLoading(true)
        setError(null)
  
        const filters: WalletFilters = {
          search: search || undefined,
          // status: statusFilter || undefined,
          // per_page: itemsPerPage,
        }
  
        const response = await walletApi.getWallets(filters)
        setWallets(response.data)
        setTotalItems(response.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wallets')
        setWallets([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }, [search,  currentPage, itemsPerPage])
  
    useEffect(() => {
      fetchWallets()
    }, [fetchWallets])
  
    // Reset to page 1 when filters change
    useEffect(() => {
      setCurrentPage(1)
    }, [search]) //statusFilter
  
    // const handleItemsPerPageChange = (value: number) => {
    //   setItemsPerPage(value)
    //   setCurrentPage(1)
    // }


  //Fetch Wallet Stats from API
  const fetchWalletStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await walletApi.getWalletStats()
      setWalletStats(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet stats')
      setWalletStats(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWalletStats()
  }, [fetchWalletStats])

  // Summary totals
  const totalBalance = walletStats?.total_balance || 0
  const totalCredits = walletStats?.total_credits || 0
  const totalDebits = walletStats?.total_debits || 0

  const columns: Column<WalletData>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.user.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-1 capitalize rounded-full text-xs font-medium ${walletStatusStyles[item.type as WalletStatus]}`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (item) => <span className="text-NEUTRAL-100">{formatNaira(item.balance)}</span>,
    },
    {
      key: 'is_frozen',
      header: 'Wallet Frozen',
      render: (item) => <span className="text-NEUTRAL-100">{item.is_frozen ? 'Yes' : 'No'}</span>,
    },
    {
      key: 'lastTransaction',
      header: 'Last Transaction',
      render: (item) => <span className="text-NEUTRAL-100">{item.last_transaction}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Name', 'Type', 'Balance', 'Last Transaction']
    const rows = wallets.map((w) => [w.user.name, w.type, w.balance, w.last_transaction])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wallet-balances.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="font-sans space-y-8">

      {/* ── Summary Cards ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SummaryCard
          label="Total Balance"
          value={
            totalBalance >= 1_000_000
              ? `₦${(totalBalance / 1_000_000).toFixed(1)}M`
              : formatNaira(totalBalance)
          }
          dark
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        />
        <SummaryCard
          label="Total Credits"
          value={formatNaira(totalCredits)}
          arrowUp
        />
        <SummaryCard
          label="Total Debits"
          value={formatNaira(totalDebits)}
          arrowDown
        />
      </div>

      {/* ── Wallet Balances ── */}
      <section>
        <h2 className="text-lg font-semibold text-NEUTRAL-100 mb-4">Wallet Balances</h2>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search wallets..."
              className="w-full pl-10 pr-4 py-2.5 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-GREY-100 rounded-lg text-sm font-medium text-NEUTRAL-100 bg-white hover:bg-GREY-300 transition-colors sm:shrink-0"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
          <Table
            columns={columns}
            data={wallets}
            emptyMessage={loading ? "Loading wallets..." : error ? "Error loading wallets" : "No wallets found"} 
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
                        setOpenWalletDetails(true)
                        setWalletDetails(item)
                      }}
                    >
                      View Details
                    </button>
                    {item.is_frozen ? (
                      <button
                        className="w-full px-4 py-2 text-sm text-left text-green-500 hover:bg-GREY-300 transition-colors"
                        onClick={() => {
                          setOpenMenuId(null)
                          setOpenUpdateWalletStatus(true)
                          setWalletDetails(item)
                        }}
                      >
                        Unfreeze Wallet
                      </button>
                    ) : (
                      <button
                        className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                        onClick={() => {
                          setOpenMenuId(null)
                          setOpenUpdateWalletStatus(true)
                          setWalletDetails(item)
                        }}
                      >
                        Freeze Wallet
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          />
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
      </section>

      <ModalPop isOpen={openUpdateWalletStatus}>
        <UpdateWalletStatus
          handleClose={() => setOpenUpdateWalletStatus(false)}
          walletDetails={walletDetails}
          onUpdate={fetchWallets}
        />
      </ModalPop>

      <ModalPop isOpen={openWalletDetails}>
        <WalletDetails
          handleClose={() => setOpenWalletDetails(false)}
          walletDetails={walletDetails}
        />
      </ModalPop>

    </div>
  )
}

export default Wallet
