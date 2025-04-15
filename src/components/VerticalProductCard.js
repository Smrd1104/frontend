import React from 'react'
import { Link } from 'react-router-dom'

const VerticalProductCard = ({ loading }) => {

    const loadingList = new Array(17).fill(null)

    return (

        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,320px))] justify-between md:gap-6 overflow-x-scroll scrollbar-none' >

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
                            <Link to={"/product/" + product?._id} key={index} className='w-full min-w-[280px] md:max-w-[280px]: md:min-w-[360px] max-w-[320px]  bg-white rounded-sm shadow-md ' onClick={() => scrollTop()}>
                                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                    <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' />
                                </div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1'>{product?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.category}</p>
                                    <div className='flex gap-3'>
                                        <p className='text-red-500 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                        <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                    </div>
                                    <button className='text-sm bg-red-500 hover:bg-red-800 text-white px-3 py-0.5 rounded-full' onClick={(e) => { handleAddToCart(e, product?._id) }}>
                                        Add to cart
                                    </button>
                                </div>

                            </Link>
                        )
                    })

                )

            }
        </div>

    )
}

export default VerticalProductCard