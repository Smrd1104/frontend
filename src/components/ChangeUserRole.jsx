import React from 'react'
import ROLE from "../common/role"
import { IoMdClose } from 'react-icons/io'
import { useState } from 'react'
import summaryApi from '../common'
import { toast } from 'react-toastify'
const ChangeUserRole = ({
    name,
    email,
    role,
    onClose,
    userId,
    callFunc
}) => {

    const [userRole, setUserRole] = useState(role)

    const handleOnchangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    const updateUserRole = async () => {
        const fetchResponse = await fetch(summaryApi.updateUser.url, {
            method: summaryApi.updateUser.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole
            })
        })

        const responseData = await fetchResponse.json()

        if (responseData.success) {
            toast.success(responseData.message)
            onClose();       // Close the modal
            callFunc();      // Refetch the user list
        }
        console.log("Role Updated", responseData)
    }

    return (
        <div className='fixed  top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200/50 bg-opacity-40'>
            <div className=' mx-auto bg-white p-4 shadow-md rounded w-full max-w-sm'>

                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose />
                </button>


                <h1 className='p-4 text-lg font-medium'>Change User Role</h1>
                <p>Name : {name} </p>
                <p>Email : {email}</p>

                <div className='flex items-center justify-between my-4'>
                    <p className=''>Role :</p>

                    <select className='border border-slate-200 px-4 py-1' value={userRole} onChange={handleOnchangeSelect}>
                        {
                            Object.values(ROLE).map(el => {
                                return (
                                    <option value={el} key={el}>{el}</option>
                                )
                            })
                        }

                    </select>
                </div>
                <button className='w-fit mx-auto cursor-pointer bg-red-600 text-white hover:bg-red-800 block border border-slate-200 px-2 py-1 rounded-full' onClick={updateUserRole}>Change Role</button>

            </div>
        </div >
    )
}

export default ChangeUserRole