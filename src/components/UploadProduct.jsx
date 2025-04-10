import React from 'react'
import { useState } from 'react'
import { CgClose } from "react-icons/cg"
import productCategory from "../helpers/productCategory"
import { FaCloudUploadAlt } from 'react-icons/fa'
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from 'react-icons/md'
const UploadProduct = ({ onClose }) => {

    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: "",
        description: "",
        price: "",
        selling: ""
    })
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
    const [fullScreenImage, setFullScreenImage] = useState("")

    const handleOnChange = () => {

    }

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0]


        const uploadImageCloudinary = await uploadImage(file)

        setData((prev) => {
            return {
                ...prev,
                productImage: [...prev.productImage, uploadImageCloudinary.url]
            }
        })
    }

    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);

        setData((prev) => ({
            ...prev,
            productImage: newProductImage,
        }));
    };

    return (
        <div className='fixed bg-slate-200/50 w-full h-full bg-opacity-35 top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex items-center justify-between py-3'>
                    <h2 className='font-bold text-lg '> UploadProduct</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>
                <form className='grid p-4 gap-3 overflow-y-auto h-[calc(80vh-100px)] scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent'>


                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='enter product name'
                        value={data?.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded '
                    />

                    <label htmlFor='brandName' className='mt-3'>Brand Name :</label>
                    <input
                        type='text'
                        id='brandName'
                        placeholder='enter brand name'
                        value={data?.brandName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded '
                    />
                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select value={data.category} className='p-2 bg-slate-100 border rounded '>
                        {
                            productCategory.map((el, index) => {
                                return (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                )
                            })
                        }
                    </select>

                    <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='cursor-pointer p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>

                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl  '><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
                                <input type='file' accept='image/*' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
                            </div>

                        </div>
                    </label>
                    <div>
                        {
                            data?.productImage?.[0] ? (
                                <div className='flex items-center  gap-2'>
                                    {
                                        data.productImage.map((el, index) => (

                                            <div className='relative group'>
                                                <img
                                                    key={index}
                                                    src={el}
                                                    alt="img"
                                                    width={100}
                                                    height={100}
                                                    className="bg-slate-100 border cursor-pointer"
                                                    onClick={() => {
                                                        setOpenFullScreenImage(true)
                                                        setFullScreenImage(el)
                                                    }}
                                                />
                                                <div className='absolute bottom-0 right-0 text-white bg-red-500 p-1 m-1 rounded-full hidden group-hover:block cursor-pointer' onClick={() => handleDeleteProductImage(index)}>
                                                    <MdDelete />
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            ) : (
                                <p className='text-red-600 text-xs'>*please upload product image</p>
                            )
                        }


                    </div>
                    <button className='px-2 py-1 bg-red-600 text-white mb-2 hover:bg-red-800 cursor-pointer'>Upload Product</button>
                </form>

            </div>
            {/* displayimage full screen */}
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
                )
            }

        </div>
    )
}

export default UploadProduct