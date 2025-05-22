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

import { useDebounce } from 'use-debounce';
import SearchNavbarMobile from './SearchNavbarMobile'




const Header = () => {

    const [menuDisplay, setMenuDisplay] = useState(false)

    const user = useSelector(state => state?.user?.user)
    const dispatch = useDispatch()
    const context = useContext(Context)
    const navigate = useNavigate()
    const searchInput = useLocation()
    const urlSearch = new URLSearchParams(searchInput?.search)
    const searchQuery = urlSearch.getAll("q")
    // const [search, setSearch] = useState(searchQuery)
    const menuRef = useRef(null); // Define the menuRef using useRef



    // search

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debouncedSearch] = useDebounce(search, 300); // Optional
    const [recentSearches, setRecentSearches] = useState([]);

    const [recentProducts, setRecentProducts] = useState([]);



    // Load recent products from localStorage on component mount
    useEffect(() => {
        const savedRecentProducts = localStorage.getItem('recentProducts');
        if (savedRecentProducts) {
            setRecentProducts(JSON.parse(savedRecentProducts));
        }
    }, []);





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

    // const handleSearch = (e) => {
    //     const { value } = e.target

    //     setSearch(value)

    //     if (value) {
    //         navigate(`/search?q=${value}`)
    //     } else {
    //         navigate("/search")
    //     }
    // }

    const handleSearch = async (e) => {
        const value = e.target.value.trim();
        setSearch(value);


        if (value) {
            try {
                const res = await fetch(`${summaryApi.searchProduct.url}?q=${encodeURIComponent(value)}`);
                const data = await res.json();

                if (res.ok) {
                    // Filter for complete word matches
                    const filteredResults = (data.data || []).filter(product => {
                        const searchTerm = value.toLowerCase();

                        const fieldsToSearch = [
                            product?.productName,
                            product?.type,
                            product?.brand,
                            product?.category,
                            product?.subcategory,
                        ];

                        return fieldsToSearch.some(field =>
                            field?.toLowerCase().includes(searchTerm)
                        );
                    });


                    setSearchResults(filteredResults);
                    setShowDropdown(true);


                } else {
                    setSearchResults([]);
                    setShowDropdown(false);
                }
            } catch (err) {
                console.error('Search failed', err);
                setSearchResults([]);
                setShowDropdown(false);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleProductClick = (product) => {
        // Add clicked product to recent products
        const updatedRecentProducts = [
            product,
            ...recentProducts.filter(p => p._id !== product._id)
        ].slice(0, 5); // Keep only 5 most recent

        setRecentProducts(updatedRecentProducts);
        localStorage.setItem('recentProducts', JSON.stringify(updatedRecentProducts));

        setSearch('');
        setSearchResults([]);
        setShowDropdown(false);
        navigate(`/product/${product._id}`);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                console.log('Clicked outside. Closing menu and dropdown.');
                setMenuDisplay(false);
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const fetchSearchResults = async () => {
            const query = debouncedSearch.trim();

            if (query) {
                try {
                    const res = await fetch(`${summaryApi.searchProduct.url}?q=${encodeURIComponent(query)}`);
                    const data = await res.json();

                    if (res.ok) {
                        const filteredResults = (data.data || []).filter(product => {
                            const fieldsToSearch = [
                                product?.productName,
                                product?.type,
                                product?.brand,
                                product?.category,
                                product?.subcategory,
                            ];

                            return fieldsToSearch.some(field =>
                                field?.toLowerCase().includes(query.toLowerCase())
                            );
                        });

                        setSearchResults(filteredResults);
                        setShowDropdown(true);
                    } else {
                        setSearchResults([]);
                        setShowDropdown(false);
                    }
                } catch (err) {
                    console.error("Search error:", err);
                    setSearchResults([]);
                    setShowDropdown(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearch]);

    useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
    }, []);

    useEffect(() => {
        if (search.trim()) {
            setRecentSearches(prev => {
                const newList = [search, ...prev.filter(s => s !== search)].slice(0, 5);
                localStorage.setItem('recentSearches', JSON.stringify(newList));
                return newList;
            });
        }
    }, [debouncedSearch]);





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

                {/* seach section
                <div className='hidden lg:flex items-center focus-within:border-red-500 w-full justify-between max-w-lg py-1  border border-gray-400 rounded focus-within:shadow-md'>
                    <input type='text' placeholder='search products here...' className='w-full  outline-none pl-2' onChange={handleSearch} value={search} />
                    <div className='text-lg min-w-[50px] text-red-500 h-8 flex items-center justify-center  ' >
                        <GrSearch />
                    </div>
                </div> */}

                {/* Search section */}
                {/* Search section desktop*/}
                <div className="relative md:block hidden lg:flex items-center w-full max-w-lg py-1 border border-gray-400 rounded focus-within:border-red-500 focus-within:shadow-md">
                    <input
                        type="text"
                        placeholder="Search products here..."
                        className="w-full outline-none pl-2 py-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} // just update state
                        onFocus={() => {
                            if (!search && (recentSearches.length > 0 || recentProducts.length > 0)) {
                                setShowDropdown(true);
                            }
                        }}
                    />

                    <div className="text-lg min-w-[50px] text-red-500 h-8 flex items-center justify-center">
                        <GrSearch />
                    </div>

                    {showDropdown && (
                        <ul ref={menuRef} className="absolute top-full left-0 w-full bg-white shadow-lg rounded z-50 max-h-60 overflow-y-auto scrollbar-none mt-2">
                            {search ? (
                                searchResults.length > 0 ? (
                                    <>
                                        <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">
                                            Search Results
                                        </li>
                                        {searchResults.map(product => (
                                            <li
                                                key={product?._id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div className='flex gap-2 items-center'>
                                                    <img src={product?.productImage[0]} className='object-scale-down w-10 h-10 hover:scale-110 transition-all' loading="lazy" />
                                                    {product?.productName}
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    <li className="px-4 py-2 text-gray-500">No results found</li>
                                )
                            ) : (
                                <>
                                    {recentProducts.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">
                                                Recently Viewed
                                            </li>
                                            {recentProducts.map((product, index) => (
                                                <li
                                                    key={"recent-product-" + index}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    <div className='flex gap-2 items-center'>
                                                        <img src={product?.productImage[0]} className='object-scale-down w-10 h-10 hover:scale-110 transition-all' loading="lazy" />
                                                        {product?.productName}
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                    {recentSearches.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">
                                                Recent Searches
                                            </li>
                                            {recentSearches.map((term, index) => (
                                                <li
                                                    key={"term" + index}
                                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                                >
                                                    <span
                                                        onClick={() => {
                                                            setSearch(term);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        🔄 {term}
                                                    </span>
                                                    {/* <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRecentSearches(prev => prev.filter((_, i) => i !== index));
                                                        }}
                                                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                                                        aria-label={`Remove recent search ${term}`}
                                                    >
                                                        ×
                                                    </button> */}
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    )}
                </div>
                {/* Search section mobile*/}






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
