import React from 'react'
import { useState } from 'react'
import summaryApi from "../common"
import { useEffect } from 'react'
import { useContext } from 'react'
import Context from "../context"
import displayINRCurrency from "../helpers/displayCurrency"
import { MdDelete } from 'react-icons/md'
const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const context = useContext(Context)

    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async () => {
        setLoading(true)
        const response = await fetch(summaryApi.addToCartProductView.url, {
            method: summaryApi.addToCartProductView.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            }
        })
        setLoading(false)


        const responseData = await response.json()
        if (responseData?.success) {
            setData(responseData?.data)
        }

    }
    useEffect(() => {
        fetchData()
    }, [])


    const increaseQty = async (id, qty) => {
        const response = await fetch(summaryApi.updateCartProduct.url, {
            method: summaryApi.updateCartProduct.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        })
        const responseData = await response.json()

        if (responseData.success) {
            fetchData()
        }
    }

    const decreaseQty = async (id, qty) => {

        if (qty >= 2) {
            const response = await fetch(summaryApi.updateCartProduct.url, {
                method: summaryApi.updateCartProduct.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            })
            const responseData = await response.json()

            if (responseData.success) {
                fetchData()
            }
        }

    }

    const deleteCartProduct = async (id) => {


        const response = await fetch(summaryApi.deleteCartProduct.url, {
            method: summaryApi.deleteCartProduct.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                _id: id,

            })
        })
        const responseData = await response.json()

        if (responseData.success) {
            fetchData()

            context.fetchUserAddToCart()
        }


    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((prev, curr) => prev + (curr?.quantity * curr?.productId?.sellingPrice), 0)

    return (

        <div className='container mx-auto p-4'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>No Data</p>
                    )
                }
            </div>
            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ?
                            (

                                loadingCart.map(el => {
                                    return (
                                        <div key={el + "Add to cart loading"} className='w-full h-32 bg-slate-200 my-2 border border-slate-300 animate-pulse rounded'>

                                        </div>
                                    )
                                })

                            )
                            :
                            (

                                data.map((product, index) => {
                                    return (
                                        <div key={(product?._id || index) + "Add to cart loading"} className='w-full h-32 bg-white my-2 border border-slate-300  rounded flex flex-row '>
                                            <div className='w-32 h-32 bg-slate-200'>
                                                <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                            </div>
                                            <div className='px-4 py-2 relative w-full'>
                                                {/* delete product */}
                                                <div className='absolute right-2 top-2 p-2  hover:bg-red-600 hover:text-white text-red-600 rounded-full' onClick={() => deleteCartProduct(product?._id)}>
                                                    <MdDelete />
                                                </div>
                                                <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 '>{product?.productId?.productName}</h2>
                                                <p className='text-slate-400 capitalize'>{product?.productId?.category}</p>

                                                <div className='flex justify-between items-center'>
                                                    <p className='text-red-500 font-medium text-md lg:text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                                    <p className='text-red-500 font-medium text-md lg:text-lg'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                                </div>


                                                <div className='flex items-center gap-2 mt-2'>
                                                    <button className='text-center w-6 h-6 rounded hover:bg-red-600 hover:text-white text-red-500 border  border-red-600' onClick={() => decreaseQty(product?._id, product?.quantity)}>-</button>
                                                    <span>{product?.quantity}</span>
                                                    <button className='w-6 h-6 text-red-500 rounded hover:bg-red-600 hover:text-white border border-red-600' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })

                            )
                    }

                </div>

                {/* summary  */}

                <div className='mt-5 lg:mt-2 w-full max-w-sm'>
                    {
                        loading ?
                            (
                                <div className='h-36 bg-slate-200 border-slate-300 animate-pulse '>

                                </div>
                            )
                            :
                            (
                                <div className='h-36 bg-white'>
                                    <h2 className='text-white bg-red-500 px-4 py-1'>Summary</h2>
                                    <div className='flex items-center justify-between px-4 py-2 gap-2 text-lg font-medium text-slate-600 '>
                                        <p>Quantity</p>
                                        <p>{totalQty}</p>
                                    </div>

                                    <div className='flex items-center justify-between px-4 py-2 gap-2 text-lg font-medium text-slate-600'>
                                        <p>Total Price</p>
                                        <p>{displayINRCurrency(totalPrice)}</p>
                                    </div>
                                    <button className='bg-blue-600 p-2 text-white w-full'>Payment</button>

                                </div>
                            )
                    }
                </div>

            </div>

        </div>
    )
}

export default Cart