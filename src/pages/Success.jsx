import React from 'react'
import success from "../assets/success.gif"
import { Link } from 'react-router-dom'
const Success = () => {
    return (
        <div className='flex flex-col items-center justify-center relative w-full  max-w-md mx-auto p-4 rounded container '>
            <img src={success} className='' />
            <p className='absolute text-green-900 text-lg font-medium bottom-20'>Payment Successfully </p>
            <Link to={"/order"} className='absolute px-3 py-2 text-green-900 text-sm font-md  border-2 bottom-7 border-green-900 hover:bg-green-900 hover:text-white  rounded fond-semibold cursor-pointer'>See order</Link>

        </div>
    )
}

export default Success