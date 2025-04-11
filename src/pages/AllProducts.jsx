import React from 'react'
import UploadProduct from '../components/UploadProduct'
import { useState } from 'react'
import summaryApi from '../common'
import { useEffect } from 'react'

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
      <div className='flex flex-wrap items-center gap-3 py-5'>
        {
          allProduct.map((product, index) => {
            return (
              <div key={index} className='bg-white p-4 rounded'>
                <img src={product?.productImage[0]} width={120} height={120} />
                <h1 className='text-center'>{product.productName}</h1>
              </div>
            )
          })
        }
      </div>

      {/* upload product components */}

      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} onUploadSuccess={fetchAllProduct} />
        )
      }

    </div>
  )
}

export default AllProducts