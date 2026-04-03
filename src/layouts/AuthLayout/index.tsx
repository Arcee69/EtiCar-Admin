import { Outlet } from 'react-router-dom'
import Logo from '../../assets/icons/logo.svg'


const AuthLayout = () => {
  return (
    <div className='w-full overflow-x-hidden relative'>
      <div className='absolute top-6 left-20'>
        <img src={Logo} alt='EtiCar Logo' className='w-24 h-24' />
      </div>
      <div className=''>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout