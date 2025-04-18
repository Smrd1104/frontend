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


const HorizontalCardProduct = ({ category, heading }) => {

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
        <div className='container mx-auto px-4 my-6 relative '>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none' ref={scrollElement}>

                <button onClick={scrollLeft} className='absolute z-10 bg-white shadow-md  rounded px-2 py-6 cursor-pointer left-4  hidden md:block text-sm'><FaAngleLeft /></button>
                <button onClick={scrollRight} className='absolute z-10 bg-white shadow-md rounded px-2 py-6 cursor-pointer right-4  hidden md:block text-sm'> <FaAngleRight /></button>

                {loading ?
                    (
                        loadingList.map((product, index) => {
                            return (
                                <div key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px] h-36 bg-white rounded-sm shadow-md flex'>
                                    <div className='bg-slate-200 h-full p-2 min-w-[120px] md:min-w-[145px] animate-pulse'>
                                    </div>
                                    <div className='p-4 grid w-full gap-2'>
                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 bg-slate-200 animate-pulse rounded-full p-1'></h2>
                                        <p className='capitalize text-slate-500 bg-slate-200 w-full rounded-full animate-pulse'></p>
                                        <div className='flex gap-3 w-full'>
                                            <p className='text-red-500 font-medium p-1 bg-slate-200 w-full  rounded-full animate-pulse'></p>
                                            <p className='text-slate-500 line-through p-1 bg-slate-200 w-full  rounded-full animate-pulse'></p>
                                        </div>
                                        <button className='text-sm  text-white px-3 py-0.5  w-full bg-slate-200  rounded-full animate-pulse'>

                                        </button>
                                    </div>

                                </div>
                            )
                        })
                    )
                    :
                    (
                        data.map((product, index) => {
                            return (
                                <Link to={"product/" + product?._id} key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px] h-36 bg-white rounded-sm shadow-md flex'>
                                    <div className='bg-slate-200 h-full p-2 min-w-[120px] md:min-w-[145px]'>
                                        <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all' />
                                    </div>
                                    <div className='md:p-3 p-2  md:grid flex flex-col md:gap-2 gap-1'>
                                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1'>{product?.productName}</h2>
                                        <p className='capitalize text-slate-500'>{product?.category}</p>
                                        <div className='flex md:flex-row flex-col md:gap-3'>
                                            <p className='text-red-500 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                            <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                        </div>
                                        <button className=' cursor-pointer text-sm bg-red-500 hover:bg-red-800 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>
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

export default HorizontalCardProduct 