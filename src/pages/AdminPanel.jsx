import React from 'react'
import { useEffect } from 'react'
import { FaRegCircleUser } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import ROLE from '../common/role'

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user])

  return (
    <div className='min-h-[calc(100vh-120px)] md:flex hidden '>

      <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
        <div className='h-32 flex flex-col justify-center items-center  '>
          <div className='text-4xl cursor-pointer relative flex justify-center mt-5' onClick={() => setMenuDisplay(prev => !prev)}>
            {
              user?.profilePic ? (
                <img src={user?.profilePic} alt={user?.name} className='w-20 h-20 rounded-full' loading="lazy" />
              ) :
                (
                  <FaRegCircleUser />
                )
            }

          </div>
          <p className='capitalize text-lg font-semibold'>{user?.name}</p>
          <p className='capitalize text-sm text-gray-500'>{user?.role || 'No role assigned'}</p>

        </div>
        {/* navigations */}
        <div>
          <nav className='grid p-4'>
            <Link to={"all-users"} className="px-2 py-1 hover:bg-slate-100">All Users</Link>
            <Link to={"all-products"} className="px-2 py-1 hover:bg-slate-100">All Products</Link>
            <Link to={"all-orders"} className="px-2 py-1 hover:bg-slate-100">All Orders</Link>
            <Link to={"all-ads"} className="px-2 py-1 hover:bg-slate-100">All Ads</Link>



          </nav>
        </div>

      </aside>

      <main className='w-full h-full p-2'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPanel