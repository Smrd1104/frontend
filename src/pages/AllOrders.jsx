import React, { useEffect, useState } from 'react';
import summaryApi from '../common';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';
const AllOrders = () => {
    const [data, setData] = useState([]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(summaryApi.allOrder.url, {
                method: summaryApi.allOrder.method,
                credentials: "include",
            });
            const responseData = await response.json();
            setData(responseData.data);
            console.log('order list', responseData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    return (
        <div>
            <div>
                {data?.length === 0 && <p>No order available</p>}
            </div>

            <div className='p-4 w-full  overflow-hidden container mx-auto'>
                {data?.map((item, index) => (
                    <div key={item.userId + index}>
                        <p className='font-medium text-lg'>
                            {moment(item.createdAt).format('LL')}
                        </p>
                        <div className='border rounded border-slate-300 p-2'>
                            <div className='flex  flex-col lg:flex-row justify-between'>
                                <div className='grid gap-5'>
                                    {item.productDetails.map((product, index) => (
                                        <div key={product.productId + index} className='flex gap-3 bg-slate-100'>
                                            <img src={product.image[0]} alt="Product" className='w-28 h-28 bg-white object-scale-down p-2' />
                                            <div>
                                                <div className='font-medium text-lg text-ellipsis'>{product.name}</div>
                                                <div className='flex items-center gap-5 mt-1'>
                                                    <div className='text-lg text-red-600'>{displayINRCurrency(product.price)}</div>
                                                    <p>Quantity:{product.quantity}</p>
                                                </div>
                                            </div>



                                        </div>
                                    ))}
                                </div>

                                <div className='flex flex-col    gap-4 p-2 min-w-[300px] '>
                                    <div>
                                        <div className='text-lg font-medium'>Payment Details:</div>
                                        <p className=' ml-1'>Payment Method:{item.paymentDetails.payment_method_type[0]}</p>
                                        <p className='  ml-1'>Payment Status:{item.paymentDetails.payment_status}</p>

                                    </div>

                                    <div>
                                        <div className='text-lg font-medium'>Shipping Details:</div>
                                        {
                                            item.shipping_options.map((shipping, index) => {
                                                return (
                                                    <div key={shipping.shipping_rate + index} className='ml-1'>Shipping Amount:{displayINRCurrency(shipping.shipping_amount)}</div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>


                            <div className=' font-semibold lg:text-lg w-fit ml-auto  '>
                                Total Amount: {displayINRCurrency(item.totalAmount)}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllOrders