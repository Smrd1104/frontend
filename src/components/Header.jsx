import React from 'react'
import Logo from './Logo'
// import img from "../assets/logo.png"
import img from "../assets/logo/brand-logo.png"

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
import { useEffect } from 'react'
import { useRef } from 'react'
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";


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
    const menuRef = useRef(null); // Define the menuRef using useRef



    // console.log('header add to cart count ', context);
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuDisplay(false); // Close the menu when clicking outside
            }
        };

        // Add event listener on mount
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='h-16 shadow-md bg-white fixed w-full z-40'>
            <div className='h-full flex items-center container mx-auto px-4 justify-between'>
                {/* logo section */}
                <div className=''>
                    <Link to={"/"}>
                        <img src={img} className='md:w-[140px] w-[80px] h-[60px] md:h-[60px] object-contain' alt="Logo" />
                        {/* <Logo w={90} h={50} /> */}
                    </Link>
                </div>

                {/* seach section */}
                <div className='hidden lg:flex items-center focus-within:border-red-500 w-full justify-between max-w-lg py-1  border border-gray-400 rounded focus-within:shadow-md'>
                    <input type='text' placeholder='search products here...' className='w-full  outline-none pl-2' onChange={handleSearch} value={search} />
                    <div className='text-lg min-w-[50px] text-red-500 h-8 flex items-center justify-center  ' >
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
                                            <img src={user?.profilePic} alt={user?.name} className='w-10 h-10 rounded-full' loading="lazy" />
                                        ) :
                                            (
                                                <FaRegCircleUser />
                                            )
                                    }

                                </div>
                            )
                        }

                        {
                            menuDisplay && (
                                <div
                                    ref={menuRef} // Attach the ref to the dropdown menu
                                    className='absolute hidden md:block bg-white bottom-0 top-11 p-2 h-fit shadow-lg rounded'
                                >
                                    <nav className='flex flex-col'>
                                        {user?.role === ROLE.ADMIN && (
                                            <Link
                                                to={"/admin-panel/all-products"}
                                                className='whitespace-nowrap hover:bg-slate-200 p-2 rounded'
                                                onClick={() => setMenuDisplay(false)}
                                            >
                                                Admin panel
                                            </Link>
                                        )}
                                        <Link
                                            to={"/order"}
                                            className='whitespace-nowrap hover:bg-slate-200 p-2 rounded'
                                            onClick={() => setMenuDisplay(false)}
                                        >
                                            Order
                                        </Link>
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
                                    <button onClick={handleLogout} className='flex flex-row items-center gap-1 px-3 py-1 rounded-full text-md text-white bg-red-600 hover:bg-red-800 cursor-pointer'>
                                        <IoMdLogOut className='rotate-270' />
                                        <p>Logout</p>
                                    </button>
                                )
                                :
                                (
                                    <Link to={"/login"} className='flex flex-row items-center gap-1  px-5 py-1 rounded-full text-white bg-red-600 hover:bg-red-800'>
                                        <IoMdLogIn className='rotate-90' />
                                        <p>Login</p>
                                    </Link>
                                )
                        }

                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header
