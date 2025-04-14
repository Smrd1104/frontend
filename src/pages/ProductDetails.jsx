import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import summaryApi from "../common/index"
import { useEffect } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import displayINRCurrency from "../helpers/displayCurrency"
import { useCallback } from 'react';
import VerticalCardProduct from "../components/VerticalCardProduct"
const ProductDetails = () => {

  const [data, setData] = useState({

    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });

  const params = useParams()
  const [loading, setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")
  const [zoomImage, setZoomImage] = useState(false)


  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0
  })

  console.log("product Id", params)

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(summaryApi.productDetails.url, {
      method: summaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id
      })
    })
    setLoading(false)


    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.productImage[0])

  }
  console.log('data', data);

  useEffect(() => {
    fetchProductDetails()
  }, [])

  const handleMouseEnterProduct = (imgURL) => {
    setActiveImage(imgURL)

  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    console.log("coordinate", left, top, width, height)

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x, y
    })


  }, [zoomImageCoordinate])


  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }


  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>

        {/* productimage */}

        <div className='flex flex-col lg:flex-row-reverse gap-4 h-96'>

          <div className='lg:h-96 lg:w-96 w-[300px] h-[300px] bg-slate-200 relative '>
            <img src={activeImage} className='w-full h-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom} />
            {/* product zoom */}
            {
              zoomImage && (
                <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[500px] p-1 bg-slate-200 -right-[510px] top-0 z-40'>
                  <div
                    className='w-full h-full min-h-[500px]  mix-blend-multiply scale-150 '

                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                    }}
                  >

                  </div>
                </div>
              )
            }


          </div>
          <div className='h-full'>
            {
              loading ?
                (
                  <div className='flex gap-2  lg:flex-col overflow-scroll scrollbar-none h-full animate-pulse  '>
                    {
                      productImageListLoading.map((el, index) => {
                        return (
                          <div key={"loadingImage"} className='h-20 w-20 bg-slate-200 rounded'>

                          </div>
                        )
                      })
                    }
                  </div>


                ) :
                (
                  <div className='flex gap-2  lg:flex-col overflow-scroll scrollbar-none h-full '>
                    {
                      data?.productImage?.map((imgURL, index) => {
                        return (
                          <div key={imgURL} className='h-20 w-20 bg-slate-200 rounded p-1'>
                            <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={() => handleMouseEnterProduct(imgURL)} onClick={() => handleMouseEnterProduct(imgURL)} />
                          </div>
                        )
                      })
                    }
                  </div>
                )
            }
          </div>

        </div>
        {/* productdetails */}
        {
          loading ? (

            <div className='grid gap-1 w-full'>
              <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-[100px]  inline-block  rounded-full'></p>
              <h2 className='text-2xl lg:text-3xl  w-[300px] h-6 lg:h-8 font-medium bg-slate-200 animate-pulse '></h2>
              <p className='text-slate-400 capitalize h-6 lg:h-8  w-[400px] bg-slate-200 animate-pulse '></p>
              <div className=' flex items-center gap-1 p-2 bg-slate-200 animate-pulse '>


              </div>
              <div className='bg-slate-200 animate-pulse flex items-center gap-2 font-medium text-2xl lg:text-3xl my-2 '>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 '></p>
                <p className='text-slate-400 line-through  h-6 lg:h-8  bg-slate-200 animate-pulse '></p>
              </div>

              <div className='flex items-center gap-3'>
                <button className='  bg-slate-200 rounded-full  h-6 lg:h-8  w-[100px] animate-pulse   px-3 py-1  min-w-[120px]  font-medium cursor-pointer transition-all'></button>
                <button className=' bg-slate-200  rounded-full h-6 lg:h-8  w-[100px] animate-pulse  px-3 py-1  min-w-[120px]   cursor-pointer transition-all'></button>

              </div>
              <div>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full  font-medium my-1'></p>
                <p className=' h-12 w-full bg-slate-200 lg:h-8 animate-pulse'></p>
              </div>
            </div>

          ) : (
            <div className='flex flex-col gap-1'>
              <p className='bg-red-200 text-red-500 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
              <h2 className='text-2xl lg:text-3xl font-medium'>{data?.productName}</h2>
              <p className='text-slate-400 capitalize'>{data?.category}</p>
              <div className='text-red-500 flex items-center gap-1'>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />

              </div>
              <div className='flex items-center gap-2 font-medium text-2xl lg:text-3xl my-2 '>
                <p className='text-red-500'>{displayINRCurrency(data?.sellingPrice)}</p>
                <p className='text-slate-400 line-through'>{displayINRCurrency(data?.price)}</p>
              </div>

              <div className='flex items-center gap-3'>
                <button className='border-2 border-red-600 px-3 py-1 rounded min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white cursor-pointer transition-all'>Buy</button>
                <button className='border-2 border-red-600 px-3 py-1 rounded min-w-[120px] text-white bg-red-600 hover:text-red-600 hover:bg-white cursor-pointer transition-all'>Add to cart</button>

              </div>
              <div>
                <p className='text-slate-600 font-medium my-1'>Description:</p>
                <p>{data?.description}</p>
              </div>
            </div>

          )
        }

      </div>
      <div className='mt-20'>
        {!loading && data.category && (
          <VerticalCardProduct category={data.category} heading={"Recommended Products "} />
        )}
      </div>
    </div >
  )
}

export default ProductDetails