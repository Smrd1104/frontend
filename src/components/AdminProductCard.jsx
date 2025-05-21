import React from 'react'
import { useState } from 'react'
import { MdDelete, MdModeEditOutline } from 'react-icons/md'
import AdminEditProduct from './AdminEditProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import summaryApi from '../common'
import { toast } from 'react-toastify'

const AdminProductCard = ({ data, fetchData }) => {

    const [editProduct, setEditProduct] = useState(false)

    // 🆕 Delete handler
    const handleDelete = async () => {
        // if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(summaryApi.deleteProduct.url, {
                method: summaryApi.deleteProduct.method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: data._id })
            });

            const resData = await res.json();

            if (resData.success) {
                toast.success('Product deleted successfully')
                fetchData(); // refresh list
            } else {
                alert(resData.message || "Failed to delete product");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (

        <div className='bg-white p-4 rounded'>
            <div className='w-40 '>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} width={120} height={120} className='mx-auto object-fill h-full' />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

                <div>
                    <div>
                        <p className='font-semibold'>
                            {
                                displayINRCurrency(data?.sellingPrice)
                            }
                        </p>
                    </div>

                    <div className='flex flex-row mt-2'>
                        <div
                            className="cursor-pointer p-2 bg-red-200 hover:bg-red-600 rounded-full text-white"
                            onClick={handleDelete}
                        >
                            <MdDelete />
                        </div>
                        <div className="cursor-pointer w-fit ml-auto p-2  bg-green-200 hover:bg-green-600 rounded-full text-white" onClick={() => setEditProduct(true)}>
                            <MdModeEditOutline />
                        </div>
                    </div>


                </div>

            </div>

            {
                editProduct && (
                    <AdminEditProduct productData={data} onClose={() => setEditProduct(false)} fetchData={fetchData} />
                )
            }


        </div >

    )
}

export default AdminProductCard