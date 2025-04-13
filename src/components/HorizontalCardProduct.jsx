import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct"
import displayINRCurrency from "../helpers/displayCurrency"
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useRef } from 'react'

const HorizontalCardProduct = ({ category, heading }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const loadingList = new Array(13).fill(null)

    const [scroll, setScroll] = useState(0)
    const scrollElement = useRef()


    const fetchData = async () => {
        setLoading(true)
        const CategoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)

        console.log("horizontal data", CategoryProduct)
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
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>
            <div className='flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none' ref={scrollElement}>

                <button onClick={scrollRight} className='absolute bg-white shadow-md rounded-full p-1 cursor-pointer left-0 text-lg hidden md:block'><FaAngleLeft /></button>
                <button onClick={scrollRight} className='absolute bg-white shadow-md rounded-full p-1 cursor-pointer right-0 text-lg hidden md:block'> <FaAngleRight /></button>

                {
                    data.map((product, index) => {
                        return (
                            <div key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px] h-36 bg-white rounded-sm shadow-md flex'>
                                <div className='bg-slate-200 h-full p-2 min-w-[120px] md:min-w-[145px]'>
                                    <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all' />
                                </div>
                                <div className='p-4 grid'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1'>{product?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.category}</p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-500 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                        <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                    </div>
                                    <button className='text-sm bg-red-500 hover:bg-red-800 text-white px-3 py-0.5 rounded-full'>
                                        Add to cart
                                    </button>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default HorizontalCardProduct 