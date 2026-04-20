import { useCallback, useEffect, useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineFunnel } from 'react-icons/hi2'

import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { transactionsApi, type TransactionFilters } from '../../services/transactions'
import type { Transaction } from '../../types/global'
import { formatNaira } from '../../helper'
import { ModalPop } from '../../components'
import TransactionsDetails from './components/TransactionsDetails'

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = 'debit' | 'credit'
type TransactionStatus = 'successful' | 'pending' | 'failed'


// ─── Style Maps ───────────────────────────────────────────────────────────────

const txTypeStyles: Record<TransactionType, string> = {
  debit: 'bg-red-50 text-red-500 border border-red-200',
  credit: 'bg-teal-50 text-teal-600 border border-teal-200',
}

const txStatusStyles: Record<TransactionStatus, string> = {
  successful: 'bg-green-50 text-green-500 border border-green-200',
  pending: 'bg-orange-50 text-orange-500 border border-orange-200',
  failed: 'bg-red-50 text-red-500 border border-red-200',
}


// ─── Component ────────────────────────────────────────────────────────────────

const Transactions = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState<'successful' | 'pending' | 'failed' | ''>('')
  const [openTransactionDetails, setOpenTransactionDetails] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<Transaction | null>(null)

  // API state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)


  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: TransactionFilters = {
        search: search || undefined,
        status: statusFilter || undefined,
        per_page: itemsPerPage,

      }

      const response = await transactionsApi.getTransactions(filters)
      setTransactions(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
      setTransactions([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, currentPage, itemsPerPage])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value)
    setCurrentPage(1)
  }


  const columns: Column<Transaction>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.id.slice(0, 8)}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${txTypeStyles[item.type]}`}>
          {item.type}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (item) => <span className="text-NEUTRAL-100">{item.user.name}</span>,
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
          {item.created_at.replace(' ', '\n')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex capitalize items-center px-3 py-1 rounded-full text-xs font-medium ${txStatusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'User', 'Description', 'Date', 'Status']
    const rows = transactions.map((t) => [t.id, t.type, t.amount, t.user.name, t.description, t.created_at, t.status])
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
        <div className='flex gap-5 items-center'>
          <div className="relative flex-1 sm:min-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-GREY-200" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions id, description..."
              className="w-full pl-10 pr-4 py-2.5 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 placeholder:text-GREY-200 focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent bg-white"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-GREY-200" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'successful' | 'pending' | 'failed' | '')}
              className="pl-9 pr-4 py-2 border border-GREY-100 rounded-lg text-sm text-NEUTRAL-100 bg-white focus:outline-none focus:ring-2 focus:ring-BLUE-400 focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
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
          data={transactions}
          emptyMessage={loading ? "Loading transactions..." : error ? "Error loading transactions" : "No transactions found"}
          onRowClick={(item) => {
            setTransactionDetails(item)
            setOpenTransactionDetails(true)
          }}
        />
        <div className="px-4 border-t border-GREY-100">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => handleItemsPerPageChange(val)}
          />
        </div>
      </div>

      <ModalPop isOpen={openTransactionDetails}>
        <TransactionsDetails
          handleClose={() => setOpenTransactionDetails(false)}
          transactionDetails={transactionDetails}
        />
      </ModalPop>


    </div>
  )
}

export default Transactions
