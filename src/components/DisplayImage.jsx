import React from 'react'
import { CgClose } from 'react-icons/cg'

const DisplayImage = ({ imgUrl, onClose }) => {
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center'>

            <div className=' bg-white shadow-lg  rounded max-w-5xl mx-auto p-2 '>

                <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                    <CgClose />
                </div>
                <div className='flex items-center p-4 max-w-[80vh] max-h-[80vh]'>
                    <img src={imgUrl} className='w-full h-full 'loading="lazy"/>
                </div>
            </div>
        </div>
    )
}

export default DisplayImage