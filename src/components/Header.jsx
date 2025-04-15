import React from 'react'
import Logo from './Logo'
import { GrSearch } from 'react-icons/gr'
import { FaRegCircleUser } from 'react-icons/fa6'
import { FaShoppingCart } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import summaryApi from '../common'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'
import { useState } from 'react'
import ROLE from '../common/role'
import Context from '../context'
import { useContext } from 'react'

const Header = () => {

    const [menuDisplay, setMenuDisplay] = useState(false)

    const user = useSelector(state => state?.user?.user)
    const dispatch = useDispatch()
    const context = useContext(Context)
    const navigate = useNavigate()
    const searchInput = useLocation()
    const urlSearch = new URLSearchParams(searchInput?.search)
    const searchQuery = urlSearch.getAll("q")
    const [search, setSearch] = useState(searchQuery)


    console.log('header add to cart count ', context);
    const handleLogout = async () => {
        const fetchData = await fetch(summaryApi.logout_user.url, {
            method: summaryApi.logout_user.method,
            credentials: "include"
        })

        const data = await fetchData.json()

        if (data.success) {
            toast.success(data.message)
            dispatch(setUserDetails(null))
            navigate("/")
        }
        if (data.error) {
            toast.error(data.message)
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target

        setSearch(value)

        if (value) {
            navigate(`/search?q=${value}`)
        } else {
            navigate("/search")
        }
    }

    return (
        <header className='h-16 shadow-md bg-white fixed w-full z-40'>
            <div className='h-full flex items-center container mx-auto px-4 justify-between'>
                {/* logo section */}
                <div className=''>
                    <Link to={"/"}>
                        <Logo w={90} h={50} />
                    </Link>
                </div>
                {/* seach section */}
                <div className='hidden lg:flex items-center w-full justify-between max-w-sm border border-gray-400 rounded-full focus-within:shadow-md'>
                    <input type='text' placeholder='search products here...' className='w-full  outline-none pl-2' onChange={handleSearch} value={search} />
                    <div className='text-lg min-w-[50px] bg-red-600 h-8 flex items-center justify-center rounded-r-full text-white' >
                        <GrSearch />
                    </div>
                </div>
                {/* cart and icons section */}
                <div className='flex items-center gap-7'>

                    <div className='relative  flex justify-center'>
                        {
                            user?._id && (
                                <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                                    {
                                        user?.profilePic ? (
                                            <img src={user?.profilePic} alt={user?.name} className='w-10 h-10 rounded-full' />
                                        ) :
                                            (
                                                <FaRegCircleUser />
                                            )
                                    }

                                </div>
                            )
                        }

                        {
                            menuDisplay &&
                            (
                                <div className='absolute hidden md:block bg-white bottom-0 top-11 p-2 h-fit shadow-lg rounded  '>
                                    <nav>
                                        {
                                            user?.role === ROLE.ADMIN && (
                                                <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hover:bg-slate-200 p-2' onClick={() => setMenuDisplay(prev => !prev)}>
                                                    Admin panel
                                                </Link>
                                            )
                                        }

                                    </nav>
                                </div>
                            )
                        }

                    </div>
                    {
                        user?._id && (
                            <Link to={"/cart"} className='text-2xl cursor-pointer relative'>
                                <span><FaShoppingCart /></span>
                                <div className='absolute -top-2 -right-3 text-white bg-red-500 w-5 h-5 rounded-full p-1 flex items-center justify-center'>
                                    <p className='text-xs'>{context?.cartProductCount}</p>
                                </div>
                            </Link>
                        )
                    }


                    {/* login section */}
                    <div>
                        {
                            user?._id ?
                                (
                                    <button onClick={handleLogout} className='px-5 py-1 rounded-full text-white bg-red-600 hover:bg-red-800 cursor-pointer'>Logout</button>
                                )
                                :
                                (
                                    <Link to={"/login"} className='px-5 py-1 rounded-full text-white bg-red-600 hover:bg-red-800'>login</Link>
                                )
                        }

                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header
