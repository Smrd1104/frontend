import React from 'react'
import UploadProduct from '../components/UploadProduct'
import { useState } from 'react'
import summaryApi from '../common'
import { useEffect } from 'react'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])

  const fetchAllProduct = async () => {
    const response = await fetch(summaryApi.allProduct.url)

    const dataResponse = await response.json()

    setAllProduct(dataResponse?.data || [])
  }

  useEffect(() => {
    fetchAllProduct()

  }, [])

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h1 className='font-bold text-lg '>All Products</h1>
        <button className='cursor-pointer border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={() => setOpenUploadProduct(true)}>Upload product</button>
      </div>

      {/* all product */}
      <div className='flex flex-wrap items-center gap-3 py-5 h-[calc(100vh-190px)] overflow-y-scroll '>
        {
          allProduct.map((product, index) => {
            return (
              <AdminProductCard data={product} key={index + "allProduct"} fetchData={fetchAllProduct} />

            )
          })
        }
      </div>

      {/* upload product components */}

      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} onUploadSuccess={fetchAllProduct} fetchData={fetchAllProduct} />
        )
      }

    </div>
  )
}

export default AllProducts