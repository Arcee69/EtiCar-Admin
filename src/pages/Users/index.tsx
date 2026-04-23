import { useState, useCallback, useEffect } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineEllipsisVertical } from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import type { UsersData } from '../../types/global'
import { ModalPop } from '../../components'
import UserDetails from './components/UserDetails'
import UpdateUser from './components/UpdateUser'
import DeactivateUser from './components/DeactivateUser'
import { usersApi } from '../../services/users'
import type { UsersFilters } from '../../services/users'

type UserStatus = 'active' | 'inactive'

// Using User type from global types

const statusStyles: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-400',
}

const Users = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [openUserDetails, setOpenUserDetails] = useState(false)
  const [openUpdateUser, setOpenUpdateUser] = useState(false)
  const [openDeactivateUser, setOpenDeactivateUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UsersData | null>(null)
  const [users, setUsers] = useState<UsersData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: UsersFilters = {
        search: search || undefined,
        per_page: itemsPerPage,
      }

      const response = await usersApi.getUsers(filters)
      setUsers(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
      setUsers([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [search, itemsPerPage])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search])


  const columns: Column<UsersData>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (item) => <span className="font-medium text-NEUTRAL-100">{item.id.slice(0, 8)}</span>,
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
      key: 'status',
      header: 'Status',
      render: (item) => {
        const status = item.status as UserStatus
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 capitalize rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {item.status}
          </span>
        )
      },
    },
    {
      key: 'registered',
      header: 'Registered On',
      render: (item) => <span className="text-NEUTRAL-100">{item.registered_at}</span>,
    },
    {
      key: 'vehicles',
      header: 'Vehicles',
      render: (item) => <span className="text-NEUTRAL-100">{item.vehicles_count}</span>,
    },
  ]

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Registered', 'Vehicles']
    const rows = users.map((u) => [u.id, u.name, u.phone, u.email, u.registered_at, u.vehicles_count])
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
            placeholder="Search by name..."
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
          data={users}
          emptyMessage={loading ? "Loading users..." : error ? "Error loading users" : "No users found"}
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
                      setSelectedUser(item); 
                      setOpenUserDetails(true); 
                      setOpenMenuId(null)
                    }}
                  >
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-NEUTRAL-100 hover:bg-GREY-300 transition-colors"
                    onClick={() => {
                      setSelectedUser(item);
                      setOpenUpdateUser(true);
                      setOpenMenuId(null);
                    }}
                  >
                    Edit User
                  </button>
                  {
                    item.status === 'active' && (
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-RED-300 hover:bg-GREY-300 transition-colors"
                      onClick={() => {
                        setSelectedUser(item);
                        setOpenDeactivateUser(true);
                        setOpenMenuId(null);
                      }}
                    >
                      Deactivate
                    </button>
                    )
                  }
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

      <ModalPop isOpen={openUserDetails}>
        <UserDetails 
          handleClose={() => setOpenUserDetails(false)}
          userDetails={selectedUser}
        />
      </ModalPop>

      <ModalPop isOpen={openUpdateUser}>
        <UpdateUser 
          handleClose={() => setOpenUpdateUser(false)}
          userDetails={selectedUser}
          onUpdate={fetchUsers} 
        />
      </ModalPop>

      <ModalPop isOpen={openDeactivateUser}>
        <DeactivateUser 
          handleClose={() => setOpenDeactivateUser(false)}
          userDetails={selectedUser}
          onUpdate={fetchUsers}
        />
      </ModalPop>


    </div>
  )
}

export default Users
