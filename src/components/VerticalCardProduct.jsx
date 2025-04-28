import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct"
import displayINRCurrency from "../helpers/displayCurrency"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const VerticalCardProduct = ({ category, heading }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const loadingList = new Array(13).fill(null)

    const [scroll, setScroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async (e, id) => {

        await addToCart(e, id)
        fetchUserAddToCart()
    }


    const fetchData = async () => {
        setLoading(true)
        const CategoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        // console.log("horizontal data", CategoryProduct)
        setData(CategoryProduct?.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 300
    }

    return (
        <div className='container mx-auto px-4 my-4 relative py-10 bg-white'>
            <h2 className='text-2xl font-semibold '>{heading}</h2>
            <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none' ref={scrollElement}>

                <button onClick={scrollLeft} className='absolute z-10 bg-white shadow-md rounded px-2 py-8 cursor-pointer left-4 text-sm hidden md:block'><FaAngleLeft /></button>
                <button onClick={scrollRight} className='absolute z-10 bg-white shadow-md rounded px-2 py-8 cursor-pointer right-4 text-sm hidden md:block'> <FaAngleRight /></button>

                {loading ?
                    (
                        loadingList.map((product, index) => {
                            return (
                                <div key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px]  bg-white rounded-sm shadow-md '>
                                    <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                                        <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                    </div>
                                    <div className='p-4 grid gap-3'>
                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 bg-slate-200 w-full rounded-full p-1 py-2 animate-pulse'></h2>
                                        <p className='capitalize text-slate-500 bg-slate-200 w-full rounded-full p-1 py-2 animate-pulse'></p>
                                        <div className='flex gap-3'>
                                            <p className='text-red-500 font-medium bg-slate-200 w-full rounded-full p-1 py-2 animate-pulse'></p>
                                            <p className='text-slate-500 line-through bg-slate-200 w-full rounded-full p-1 py-2 animate-pulse'></p>
                                        </div>
                                        <button className='text-sm  text-white px-3  rounded-full bg-slate-200 w-full p-1 py-2 animate-pulse'>

                                        </button>
                                    </div>

                                </div>
                            )
                        })
                    ) : (
                        data.map((product, index) => {
                            return (
                                <Link to={"product/" + product?._id} key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px]  bg-slate-50 rounded-sm shadow-md '>
                                    <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                        <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply'loading="lazy" />
                                    </div>
                                    <div className='p-4 grid gap-3'>
                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1'>{product?.productName}</h2>
                                        <p className='capitalize text-slate-500'>{product?.category}</p>
                                        <div className='flex gap-3'>
                                            <p className='text-red-500 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                            <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                        </div>
                                        <button className='cursor-pointer text-sm bg-red-500 hover:bg-red-800 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>
                                            Add to cart
                                        </button>
                                    </div>

                                </Link>
                            )
                        })

                    )

                }
            </div>

        </div>
    )
}

export default VerticalCardProduct 