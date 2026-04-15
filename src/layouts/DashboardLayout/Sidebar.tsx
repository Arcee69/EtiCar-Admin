import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineClipboardDocumentList,
  HiOutlineWallet,
  HiOutlineBanknotes,
  HiOutlineBell,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { LuLogOut } from 'react-icons/lu'

import Logo from '../../assets/icons/logo.svg'

import { ModalPop } from '../../components'
import Logout from '../../components/Logout'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'


const sections = [
  {
    label: 'MAIN',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
      { path: '/users', label: 'Users', icon: HiOutlineUsers },
      { path: '/vehicles', label: 'Vehicles', icon: HiOutlineTruck },
      { path: '/providers', label: 'Providers', icon: HiOutlineUserGroup },
      { path: '/vendors', label: 'Vendors', icon: HiOutlineBuildingStorefront },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { path: '/service-requests', label: 'Service Requests', icon: HiOutlineClipboardDocumentList },
      { path: '/orders', label: 'Orders', icon: HiOutlineShoppingCart },
      { path: '/wallet', label: 'Wallets', icon: HiOutlineWallet },
      { path: '/transactions', label: 'Transactions', icon: HiOutlineBanknotes },
      { path: '/inventory', label: 'Inventory', icon: HiOutlineCube },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
      { path: '/notifications', label: 'Notifications', icon: HiOutlineBell },
      { path: '/roles', label: 'Admin Roles', icon: HiOutlineShieldCheck },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false)
  
  const { user } = useSelector((state: RootState) => state.auth)


  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 bg-NEUTRAL-200  flex flex-col z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-GREY-400">
        <img src={Logo} alt="logo" className="w-24 h-24" />
        <div className="flex items-center gap-2">
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-GREY-200 hover:text-white hover:bg-GREY-400 transition-colors"
            aria-label="Close sidebar"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4  px-3">
        {sections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold text-GREY-200 tracking-widest uppercase">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white'
                          : 'text-GREY-200 hover:bg-GREY-400 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className='flex items-center gap-3 px-3.5 cursor-pointer' onClick={() => setIsLogoutModalOpen(true)}>
          <LuLogOut className='text-red-500' size={20} />
          <p className="text-sm font-medium text-red-500 truncate">Logout</p>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-GREY-400">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 bg-GREY-200 rounded-full flex items-center justify-center shrink-0">
            <span className="text-NEUTRAL-200 text-sm font-semibold">{user?.full_name?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-GREY-200 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <ModalPop isOpen={isLogoutModalOpen}>
        <Logout handleClose={() => setIsLogoutModalOpen(false)}/>
      </ModalPop>
    </aside>
  )
}

export default Sidebar
