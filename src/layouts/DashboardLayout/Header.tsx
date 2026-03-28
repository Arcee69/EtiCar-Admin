import { HiOutlineBell, HiOutlineBars3 } from 'react-icons/hi2'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-GREY-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100 transition-colors"
          aria-label="Open sidebar"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>

        <p>
          <span className="text-NEUTRAL-100 font-semibold">Dashboard</span>
        </p>
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-GREY-200 hover:bg-GREY-300 hover:text-NEUTRAL-100 transition-colors">
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 bg-NEUTRAL-100 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-NEUTRAL-100 leading-tight">Admin User</p>
            <p className="text-xs text-GREY-200">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
