import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import summaryApi from '../common'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)
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
            <div className='flex items-center bg-white p-4 rounded gap-4 justify-between  overflow-scroll scrollbar-none'>
                {
                    loading ? (

                        categoryLoading.map((el, index) => {
                            return (
                                <div key={"categoryLoading" + index} className='h-16 w-16 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'>

                                </div>
                            )
                        })


                    ) : (
                        categoryProduct?.map((product, index) => {
                            return (
                                <Link to={"/product-category?category=" + product?.category} className='cursor-pointer' key={product?.category}>
                                    <div className='w-16 h-16 bg-slate-200 p-4 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center'>
                                        <img src={product?.productImage[0]} alt={product.category} className='h-full object-scale-down mix-blend-multiply hover:scale-105 transition-all' loading="lazy" />
                                    </div>
                                    <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                                </Link>
                            )
                        }))
                }
            </div>
        </div>
    )
}

export default CategoryList