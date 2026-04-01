import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

// ─── Types ────────────────────────────────────────────────────────────────────

type WalletStatus = 'Active' | 'In-Progress' | 'Pending'

interface WalletBalance {
  id: string
  name: string
  type: WalletStatus
  balance: number
  lastTransaction: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockWallets: WalletBalance[] = [
  { id: 'W001', name: 'Chukwuemeka Obi',     type: 'Active',      balance: 45000,   lastTransaction: '2026-03-07' },
  { id: 'W002', name: 'AutoFix Lagos',        type: 'In-Progress', balance: 245000,  lastTransaction: '2026-03-07' },
  { id: 'W003', name: 'Amara Parts',          type: 'Pending',     balance: 890000,  lastTransaction: '2026-03-06' },
  { id: 'W004', name: 'QuickTyre Services',   type: 'In-Progress', balance: 128000,  lastTransaction: '2026-03-07' },
  { id: 'W005', name: 'Capital Spares',       type: 'Pending',     balance: 1250000, lastTransaction: '2026-03-07' },
  { id: 'W006', name: 'Aisha Mohammed',       type: 'Active',      balance: 12000,   lastTransaction: '2026-03-06' },
  { id: 'W007', name: 'Northern Auto Supply', type: 'Pending',     balance: 456000,  lastTransaction: '2026-03-05' },
]

// ─── Style Maps ───────────────────────────────────────────────────────────────

const walletStatusStyles: Record<WalletStatus, string> = {
  'Active':      'bg-teal-50 text-teal-600 border border-teal-200',
  'In-Progress': 'bg-blue-50 text-blue-500 border border-blue-200',
  'Pending':     'bg-orange-50 text-orange-500 border border-orange-200',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`

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
    className={`flex-1 min-w-[180px] rounded-xl p-5 flex items-center justify-between gap-4 border ${
      dark
        ? 'bg-NEUTRAL-300 border-NEUTRAL-200 text-white'
        : 'bg-white border-GREY-100 text-NEUTRAL-100'
    }`}
  >
    <div>
      <p className={`text-sm mb-1 ${dark ? 'text-white/70' : 'text-GREY-200'}`}>{label}</p>
      <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-NEUTRAL-100'}`}>{value}</p>
    </div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        dark ? 'bg-white/10' : 'bg-GREY-300'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filtered = mockWallets.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.type.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Summary totals
  const totalBalance = mockWallets.reduce((s, w) => s + w.balance, 0)
  const totalCredits = 230250   // representative mock value
  const totalDebits  = 23200    // representative mock value

  const columns: Column<WalletBalance>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${walletStatusStyles[item.type]}`}>
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
      key: 'lastTransaction',
      header: 'Last Transaction',
      render: (item) => <span className="text-NEUTRAL-100">{item.lastTransaction}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['Name', 'Type', 'Balance', 'Last Transaction']
    const rows = filtered.map((w) => [w.name, w.type, w.balance, w.lastTransaction])
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
            data={paginated}
            emptyMessage="No wallets found"
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

    </div>
  )
}

export default Wallet
