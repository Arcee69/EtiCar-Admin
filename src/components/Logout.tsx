import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { logoutAdmin } from '../services/auth'
import { toast } from 'sonner'
import { CiWarning } from 'react-icons/ci'
import { CgSpinner } from 'react-icons/cg'

interface LogoutProps {
  handleClose: () => void;
}

const Logout = ({ handleClose }: LogoutProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      dispatch(logout())
      toast.success('Logged out successfully')
      handleClose()
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className='min-w-sm bg-white rounded-lg h-64 mt-44 shadow-lg p-6 border border-GREY-100'>
      <div className='text-center'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <CiWarning className='text-red-500' size={24} />
        </div>
        <h3 className='text-lg font-semibold text-neutral-900 mb-2'>Logout Confirmation</h3>
        <p className='text-sm text-neutral-600 mb-6'>Are you sure you want to logout?</p>
        <div className='flex gap-3 justify-center'>
          <button
            onClick={handleClose}
            className='px-4 py-2 text-sm font-medium text-neutral-700 cursor-pointer border rounded-lg border-GREY-100 hover:text-neutral-900 transition-colors'
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 cursor-pointer rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50'
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <CgSpinner className='text-white text-center animate-spin'/> : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout