import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const ProductItem = ({ product, handleCategoryClick }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [autoRotate, setAutoRotate] = useState(false)

    const nextImage = (e) => {
        e?.stopPropagation()
        setCurrentImageIndex(prev =>
            (prev + 1) % product.productImage.length
        )
    }

    const prevImage = (e) => {
        e?.stopPropagation()
        setCurrentImageIndex(prev =>
            (prev - 1 + product.productImage.length) % product.productImage.length
        )
    }

    useEffect(() => {
        if (autoRotate && product.productImage.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => 
                    (prev + 1) % product.productImage.length
                )
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [autoRotate, product.productImage.length])

    return (
        <div
            className='cursor-pointer flex flex-col items-center relative group'
            onClick={() => handleCategoryClick(product?.category)}
            onMouseEnter={() => setAutoRotate(true)}
            onMouseLeave={() => setAutoRotate(false)}
        >
            <div className='w-16 h-16 bg-slate-100 p-4 md:w-44 md:h-44 rounded-full overflow-hidden flex items-center justify-center relative'>
                <img
                    src={product?.productImage[currentImageIndex]}
                    alt={product.category}
                    className='h-full object-scale-down mix-blend-multiply hover:scale-105 transition-all duration-300'
                    loading="lazy"
                />

                {product.productImage.length > 1 && (
                    <>
                        <button
                            className='absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10'
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="h-4 w-4 text-gray-800" />
                        </button>

                        <button
                            className='absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10'
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="h-4 w-4 text-gray-800" />
                        </button>
                    </>
                )}

                {product.productImage.length > 1 && (
                    <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1'>
                        {product.productImage.map((_, idx) => (
                            <span
                                key={idx}
                                className={`block h-1.5 w-1.5 rounded-full transition-all ${
                                    currentImageIndex === idx
                                        ? 'bg-gray-800 w-4'
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <p className='text-center text-sm md:text-base capitalize mt-2'>
                {product?.category}
            </p>
            <p className='text-center text-sm md:text-[0.9rem] text-red-600 font-semibold capitalize'>
                <span className='text-slate-800'>From</span> ₹{product?.price}
            </p>
        </div>
    )
}

export default ProductItem
