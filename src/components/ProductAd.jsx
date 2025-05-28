import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import summaryApi from '../common'

const ProductAd = ({ reverseOrder = false }) => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)
    const navigate = useNavigate()
    const scrollElement = useRef()

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(summaryApi.categoryProduct.url, {
            method: summaryApi.categoryProduct.method
        })
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(reverseOrder ? [...dataResponse.data].reverse() : dataResponse.data)
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [reverseOrder])

    const checkScrollPosition = () => {
        if (scrollElement.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollElement.current
            setShowLeftButton(scrollLeft > 0)
            setShowRightButton(scrollLeft < scrollWidth - clientWidth)
        }
    }

    useEffect(() => {
        const element = scrollElement.current
        if (element) {
            element.addEventListener('scroll', checkScrollPosition)
            // Initial check
            checkScrollPosition()
            return () => element.removeEventListener('scroll', checkScrollPosition)
        }
    }, [categoryProduct, loading]) // Re-check when data changes

    const scrollRight = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollLeft += 300
            // Check position after scroll
            setTimeout(checkScrollPosition, 300)
        }
    }

    const scrollLeft = () => {
        if (scrollElement.current) {
            scrollElement.current.scrollLeft -= 300
            // Check position after scroll
            setTimeout(checkScrollPosition, 300)
        }
    }

    const handleCategoryClick = (category) => {
        navigate(`/product-category?category=${category}`)
    }

    return (
        <div className='container mx-auto p-2  relative'>
            <div
                className='flex items-center bg-white p-2 rounded gap-4 justify-between overflow-scroll scrollbar-none'
                ref={scrollElement}
                onScroll={checkScrollPosition}
            >
                {showLeftButton && (
                    <button
                        onClick={scrollLeft}
                        className='absolute z-10 bg-white shadow-md rounded px-2 py-6 cursor-pointer left-4 hidden md:block text-sm'
                    >
                        <FaAngleLeft />
                    </button>
                )}
                {showRightButton && (
                    <button
                        onClick={scrollRight}
                        className='absolute z-10 bg-white shadow-md rounded px-2 py-6 cursor-pointer right-4 hidden md:block text-sm'
                    >
                        <FaAngleRight />
                    </button>
                )}
                {
                    loading ? (
                        categoryLoading.map((el, index) => {
                            return (
                                <div className='flex flex-col gap-1 ' key={index}>
                                    <div className='h-16 w-16 md:p-24 p-8 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'></div>
                                    <p className='text-center text-sm md:text-base capitalize bg-slate-200 animate-pulse p-2'></p>
                                </div>
                            )
                        })
                    ) : (
                        categoryProduct?.map((product, index) => {
                            return (
                                <div className='cursor-pointer flex flex-col items-center'
                                    key={product?.category}
                                    onClick={() => handleCategoryClick(product?.category)}>
                                    <div className='w-16 h-16 bg-slate-100 p-4 md:w-44 md:h-44 rounded-full overflow-hidden flex items-center justify-center'>
                                        <img src={product?.productImage[0]} alt={product.category} className='h-full object-scale-down mix-blend-multiply hover:scale-105 transition-all' loading="lazy" />
                                    </div>
                                    <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                                    <p className='text-center text-sm md:text-[0.9rem] text-red-600 font-semibold capitalize'><span className='text-slate-800'>From</span> ₹{product?.price}</p>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default ProductAd