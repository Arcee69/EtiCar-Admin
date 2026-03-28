import { Outlet } from 'react-router-dom'


const AuthLayout = () => {
  return (
    <div className='w-full overflow-x-hidden'>
 
      <div className=''>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout