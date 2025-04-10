import React from 'react'
import UploadProduct from '../components/UploadProduct'
import { useState } from 'react'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h1 className='font-bold text-lg '>All Products</h1>
        <button className='cursor-pointer border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={() => setOpenUploadProduct(true)}>Upload product</button>
      </div>

      {/* upload product components */}

      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} />
        )
      }

    </div>
  )
}

export default AllProducts