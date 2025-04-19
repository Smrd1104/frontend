import React from 'react'
import cancel from "../assets/cancel.webp"
import { Link } from 'react-router-dom'
const Cancel = () => {
    return (
        <div className='flex flex-col items-center justify-center  w-full  max-w-md mx-auto p-4 rounded container gap-3 bg-slate-300 mt-5 '>
            <img src={cancel} width={300} className='' />
            <p className=' text-red-900 text-lg font-medium bottom-20'>Payment Cancelled </p>
            <Link to={"/cart"} className=' px-3 py-2 text-red-900 text-sm font-md  border-2 bottom-7 border-red-900 hover:bg-red-900 hover:text-white  rounded fond-semibold cursor-pointer'>Go To Cart</Link>

        </div>
    )
}

export default Cancel