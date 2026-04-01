import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = 'Debit' | 'Credit'
type TransactionStatus = 'Completed' | 'Pending' | 'Failed'

interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  date: string
  status: TransactionStatus
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockTransactions: Transaction[] = [
  { id: 'T001', type: 'Debit',  amount: 15000,  description: 'Oil Change Service Payment',  date: '2026-03-07 09:45', status: 'Completed' },
  { id: 'T002', type: 'Credit', amount: 12750,  description: 'Service Payment (Oil Change)', date: '2026-03-07 09:45', status: 'Completed' },
  { id: 'T003', type: 'Credit', amount: 25000,  description: 'Brake Pads Sale',              date: '2026-03-06 14:30', status: 'Completed' },
  { id: 'T004', type: 'Credit', amount: 50000,  description: 'Wallet Top-up',                date: '2026-03-06 08:00', status: 'Completed' },
  { id: 'T005', type: 'Credit', amount: 45000,  description: 'Headlight Assembly Sale',      date: '2026-03-07 11:00', status: 'Pending'   },
  { id: 'T006', type: 'Credit', amount: 8500,   description: 'Wheel Alignment Service',      date: '2026-03-05 16:00', status: 'Completed' },
  { id: 'T007', type: 'Debit',  amount: 3200,   description: 'Platform Fee',                 date: '2026-03-05 12:00', status: 'Completed' },
  { id: 'T008', type: 'Credit', amount: 67000,  description: 'Engine Oil Bulk Sale',         date: '2026-03-04 10:30', status: 'Completed' },
  { id: 'T009', type: 'Debit',  amount: 5000,   description: 'Withdrawal',                   date: '2026-03-04 09:00', status: 'Failed'    },
  { id: 'T010', type: 'Credit', amount: 22000,  description: 'Tyre Replacement Service',     date: '2026-03-03 15:45', status: 'Completed' },
]

// ─── Style Maps ───────────────────────────────────────────────────────────────

const txTypeStyles: Record<TransactionType, string> = {
  Debit:  'bg-orange-50 text-orange-500 border border-orange-200',
  Credit: 'bg-teal-50 text-teal-600 border border-teal-200',
}

const txStatusStyles: Record<TransactionStatus, string> = {
  Completed: 'bg-blue-50 text-blue-500 border border-blue-200',
  Pending:   'bg-orange-50 text-orange-500 border border-orange-200',
  Failed:    'bg-red-50 text-red-500 border border-red-200',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`

// ─── Component ────────────────────────────────────────────────────────────────

const Transactions = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filtered = mockTransactions.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = filtered.length
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const columns: Column<Transaction>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.id}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${txTypeStyles[item.type]}`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => <span className="text-NEUTRAL-100">{formatNaira(item.amount)}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => <span className="text-NEUTRAL-100">{item.description}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (item) => (
        <span className="text-NEUTRAL-100 whitespace-pre-line">
          {item.date.replace(' ', '\n')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${txStatusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Description', 'Date', 'Status']
    const rows = filtered.map((t) => [t.id, t.type, t.amount, t.description, t.date, t.status])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="font-sans">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search transactions..."
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <Table
          columns={columns}
          data={paginated}
          emptyMessage="No transactions found"
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

    </div>
  )
}

export default Transactions
