import { useState } from 'react'
import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowDownTray,
  HiOutlineEllipsisVertical,
} from 'react-icons/hi2'
import Table, { type Column } from '../../components/Table'
import Pagination from '../../components/Pagination'
import { ModalPop } from '../../components'
import ViewDetails from './components/ViewDetails'
import type { Provider } from '../../types/global'


const mockProviders: Provider[] = [
  {
    id: 'P001',
    name: 'AutoFix Lagos',
    phone: '+234 810 111 2222',
    services: ['Mechanic', 'Electrical'],
    city: 'Lagos',
    activeJobs: 3,
    completed: 87,
    wallet: '₦245,000',
    email: 'support@autofixlagos.ng',
    registrationDate: '2025-03-12',
    businessType: 'Workshop',
    status: 'Pending',
    documents: {
      idCard: 'National ID - Yusuf Adewale',
      businessRegistration: 'CAC RC 1358821',
      addressProof: 'PHCN Utility Bill - March 2026',
    },
  },
  {
    id: 'P002',
    name: 'QuickTyre Services',
    phone: '+234 810 222 3333',
    services: ['Tyre Change', 'Wheel Alignment'],
    city: 'Lagos',
    activeJobs: 1,
    completed: 45,
    wallet: '₦120,500',
    email: 'hello@quicktyre.ng',
    registrationDate: '2025-05-21',
    businessType: 'Mobile Unit',
    status: 'Verified',
    documents: {
      idCard: 'Driver License - Chinedu Obi',
      businessRegistration: 'CAC BN 9876124',
      addressProof: 'Tenancy Agreement - Ikeja Office',
    },
  },
  {
    id: 'P003',
    name: 'AbujaMech Pro',
    phone: '+234 810 333 4444',
    services: ['Mechanic', 'Oil Change'],
    city: 'Abuja',
    activeJobs: 2,
    completed: 62,
    wallet: '₦180,000',
    email: 'admin@abujamechpro.com',
    registrationDate: '2025-07-02',
    businessType: 'Workshop',
    status: 'Pending',
    documents: {
      idCard: 'Voter Card - Amina Bello',
      businessRegistration: 'CAC RC 5542176',
      addressProof: 'Water Bill - Wuse 2 Branch',
    },
  },
  {
    id: 'P004',
    name: 'Kano Auto Care',
    phone: '+234 810 444 5555',
    services: ['Body Work', 'Painting'],
    city: 'Kano',
    activeJobs: 0,
    completed: 23,
    wallet: '₦67,500',
    email: 'service@kanoautocare.ng',
    registrationDate: '2025-08-10',
    businessType: 'Workshop',
    status: 'Declined',
    documents: {
      idCard: 'National ID - Suleiman Idris',
      businessRegistration: 'CAC RC 8021135',
      addressProof: 'Shop Rent Receipt - Zaria Road',
    },
  },
  {
    id: 'P005',
    name: 'Ibadan Express Fix',
    phone: '+234 810 555 6666',
    services: ['AC Repair', 'Electrical'],
    city: 'Ibadan',
    activeJobs: 4,
    completed: 110,
    wallet: '₦320,000',
    email: 'care@ibadanexpressfix.ng',
    registrationDate: '2025-09-15',
    businessType: 'Mobile Unit',
    status: 'Pending',
    documents: {
      idCard: 'National ID - Tunde Alao',
      businessRegistration: 'CAC BN 3197721',
      addressProof: 'Bank Statement - Business Address',
    },
  },
  {
    id: 'P006',
    name: 'Port Harcourt Motors',
    phone: '+234 810 666 7777',
    services: ['Mechanic', 'Tyre Change'],
    city: 'Port Harcourt',
    activeJobs: 2,
    completed: 78,
    wallet: '₦215,000',
    email: 'ops@phmotors.ng',
    registrationDate: '2025-10-05',
    businessType: 'Workshop',
    status: 'Verified',
    documents: {
      idCard: 'Driver License - Ebikeme Johnson',
      businessRegistration: 'CAC RC 7712349',
      addressProof: 'Utility Bill - GRA Workshop',
    },
  },
  {
    id: 'P007',
    name: 'Enugu Auto Hub',
    phone: '+234 810 777 8888',
    services: ['Oil Change', 'Brake Service'],
    city: 'Enugu',
    activeJobs: 1,
    completed: 34,
    wallet: '₦95,000',
    email: 'team@enuguautohub.ng',
    registrationDate: '2025-10-29',
    businessType: 'Workshop',
    status: 'Pending',
    documents: {
      idCard: 'National ID - Chinwe Okafor',
      businessRegistration: 'CAC BN 4499820',
      addressProof: 'Landlord Attestation - Ogui Road',
    },
  },
  {
    id: 'P008',
    name: 'Warri Speed Garage',
    phone: '+234 810 888 9999',
    services: ['Mechanic', 'Body Work'],
    city: 'Warri',
    activeJobs: 3,
    completed: 56,
    wallet: '₦158,000',
    email: 'info@warrispeedgarage.ng',
    registrationDate: '2025-11-11',
    businessType: 'Workshop',
    status: 'Pending',
    documents: {
      idCard: 'Voter Card - Efe Omoruyi',
      businessRegistration: 'CAC RC 9834101',
      addressProof: 'Insurance Letter - Facility Address',
    },
  },
  {
    id: 'P009',
    name: 'Benin Auto Works',
    phone: '+234 810 999 0000',
    services: ['Electrical', 'AC Repair'],
    city: 'Benin City',
    activeJobs: 0,
    completed: 41,
    wallet: '₦112,000',
    email: 'contact@beninautoworks.ng',
    registrationDate: '2025-11-27',
    businessType: 'Mobile Unit',
    status: 'Declined',
    documents: {
      idCard: 'National ID - Osaze Eromosele',
      businessRegistration: 'CAC BN 6654309',
      addressProof: 'Shop Lease - Ring Road',
    },
  },
  {
    id: 'P010',
    name: 'Kaduna Fix It',
    phone: '+234 811 000 1111',
    services: ['Mechanic', 'Wheel Alignment'],
    city: 'Kaduna',
    activeJobs: 2,
    completed: 67,
    wallet: '₦189,500',
    email: 'hello@kadunafixit.ng',
    registrationDate: '2025-12-09',
    businessType: 'Workshop',
    status: 'Pending',
    documents: {
      idCard: 'Driver License - Habib Musa',
      businessRegistration: 'CAC RC 7102943',
      addressProof: 'PHCN Bill - Barnawa Workshop',
    },
  },
]

const statusClassMap: Record<Provider['status'], string> = {
  Pending: 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  Verified: 'bg-green-400/15 text-green-400 border-green-400/30',
  Declined: 'bg-red-400/15 text-red-400 border-red-400/30',
}

const Providers = () => {
  const [providers, setProviders] = useState<Provider[]>(mockProviders)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  const filtered = providers.filter(
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
    {
      key: 'status',
      header: 'Verification',
      render: (item) => (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassMap[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ]

  const openVerificationModal = (provider: Provider) => {
    setSelectedProvider(provider)
    setShowVerificationModal(true)
    setOpenMenuId(null)
  }

  const closeVerificationModal = () => {
    setShowVerificationModal(false)
    setSelectedProvider(null)
  }

  const updateVerificationStatus = (id: string, status: string) => {
    setProviders((prev) =>
      prev.map((provider) =>
        provider.id === id
          ? {
              ...provider,
              status: status as Provider['status'],
            }
          : provider
      )
    )

    closeVerificationModal()
  }

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
                    onClick={() => openVerificationModal(item)}
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

      <ModalPop isOpen={showVerificationModal} closeModal={closeVerificationModal}>
        <ViewDetails 
          selectedProvider={selectedProvider}
          closeVerificationModal={closeVerificationModal}
          updateVerificationStatus={updateVerificationStatus}
          statusClassMap={statusClassMap}
        />
      </ModalPop>
    </div>
  )
}

export default Providers
