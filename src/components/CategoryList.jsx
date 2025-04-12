import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import summaryApi from '../common'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(summaryApi.categoryProduct.url, {
            method: summaryApi.categoryProduct.method
        })
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }
    useEffect(() => {
        fetchCategoryProduct()
    }, [])
    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center gap-4 justify-between  overflow-scroll scrollbar-none'>
                {
                    categoryProduct?.map((product, index) => {
                        return (
                            <div className=''>
                                <div className='w-16 h-16 bg-white p-3 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center'>
                                    <img src={product?.productImage[0]} alt={product.category} className='h-full object-fill' />
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategoryList