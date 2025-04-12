import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

import productCategory from "../helpers/productCategory";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import summaryApi from '../common';

const AdminEditProduct = ({ onClose, productData,fetchData, onUploadSuccess }) => {

    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName,
        brandName: productData?.brandName,
        category: productData?.category,
        productImage: productData?.productImage || [],
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);
        setData(prev => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
    };

    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        setData(prev => ({
            ...prev,
            productImage: newProductImage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.productImage.length === 0) {
            toast.error("Please upload at least one product image!");
            onUploadSuccess?.();
            return;
        }

        const response = await fetch(summaryApi.updateProduct.url, {
            method: summaryApi.updateProduct.method,
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
            toast.success(responseData?.message || "Product uploaded successfully!");
            onUploadSuccess?.();
            fetchData();
            onClose();
        } else {
            toast.error(responseData?.message || "Something went wrong!");
        }
    };

    return (
        <div className='fixed bg-slate-200/10 w-full h-full bg-opacity-35 top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex items-center justify-between py-3'>
                    <h2 className='font-bold text-lg'>Edit Product</h2>
                    <div
                        className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer'
                        onClick={onClose}
                    >
                        <CgClose />
                    </div>
                </div>

                <form
                    className='grid p-4 gap-3 overflow-y-auto h-[calc(80vh-100px)] scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent'
                    onSubmit={handleSubmit}
                >
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        name='productName'
                        placeholder='Enter product name'
                        value={data.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                    <input
                        type='text'
                        id='brandName'
                        name='brandName'
                        placeholder='Enter brand name'
                        value={data.brandName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select
                        value={data.category}
                        required
                        name='category'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="">Select Category</option>
                        {productCategory.map((el, index) => (
                            <option value={el.value} key={el.value + index}>{el.label}</option>
                        ))}
                    </select>

                    <label htmlFor='productImage' className='mt-3 block'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='cursor-pointer p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input
                                    type='file'
                                    accept='image/*'
                                    name='productImage'
                                    id='uploadImageInput'
                                    className='hidden'
                                    onChange={handleUploadProduct}
                                />
                            </div>
                        </div>
                    </label>

                    <div>
                        {data.productImage.length > 0 ? (
                            <div className='flex items-center gap-2'>
                                {data.productImage.map((el, index) => (
                                    <div key={index} className='relative group'>
                                        <img
                                            src={el}
                                            alt="img"
                                            width={100}
                                            height={100}
                                            className="bg-slate-100 border cursor-pointer"
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(el);
                                            }}
                                        />
                                        <div
                                            className='absolute bottom-0 right-0 text-white bg-red-500 p-1 m-1 rounded-full hidden group-hover:block cursor-pointer'
                                            onClick={() => handleDeleteProductImage(index)}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload product image</p>
                        )}
                    </div>

                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Enter price'
                        value={data.price}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='sellingPrice' className='mt-3'>Selling Price :</label>
                    <input
                        type='number'
                        id='sellingPrice'
                        name='sellingPrice'
                        placeholder='Enter selling price'
                        value={data.sellingPrice}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='Enter product description'
                        name='description'
                        onChange={handleOnChange}
                        rows={3}
                        value={data.description}
                    />

                    <button
                        type='submit'
                        className='px-2 py-1 bg-red-600 text-white mb-2 hover:bg-red-800 cursor-pointer'
                    >
                        Update Product
                    </button>
                </form>
            </div>

            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}
        </div>
    );
};

export default AdminEditProduct;
