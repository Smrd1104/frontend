import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import summaryApi from '../common';
import { toast } from 'react-toastify';
import moment from "moment"
import { MdDelete, MdModeEdit } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';
import DeleteUserPopup from '../components/DeleteUserPopup';

const AllUsers = () => {

    const [allUsers, setAllUsers] = useState([]);

    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);


    const [openUpdateRole, setOpenUpdateRole] = useState(false);

    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        _id: ""
    })

    const fetchAllUsers = async () => {
        const fetchData = await fetch(summaryApi.allUser.url, {
            method: summaryApi.allUser.method,
            credentials: "include"
        })

        const dataResponse = await fetchData.json()

        if (dataResponse.success) {
            setAllUsers(dataResponse.data)
        }

        if (dataResponse.error) {
            toast.error(dataResponse.message)
        }


        // console.log(dataResponse)
    }


    const handleDeleteUser = async (userId) => {
        try {
            const { url, method } = summaryApi.deleteUser(userId); // Ensure deleteUser returns { url, method }


            const response = await fetch(url, {
                method,
                credentials: "include", // optional: include if your server uses cookies
            });

            const result = await response.json();

            if (response.ok) {
                fetchAllUsers(); // refresh user list
                toast.success('User deleted successfully');
            } else {

                toast.error(result.message || 'Failed to delete user');
            }
        } catch (error) {

            toast.error('Something went wrong while deleting the user.');
        } finally {
            setOpenDeletePopup(false);
            setSelectedUserForDelete(null);
        }
    };


    useEffect(() => {
        fetchAllUsers()
    }, [])
    return (
        <div className='pb-4 bg-white'>
            <table className='w-full userTable '>
                <thead>
                    <tr className='bg-black text-white'>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created Date</th>
                        <th>Action</th>

                    </tr>
                </thead>

                <tbody>
                    {allUsers.map((el, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format("lll")}</td>
                                <td>
                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' onClick={() => {
                                        setUpdateUserDetails(el)
                                        setOpenUpdateRole(true)
                                    }}>
                                        <MdModeEdit />
                                    </button>

                                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' onClick={() => {
                                        setOpenDeletePopup(true);
                                        setSelectedUserForDelete(el)
                                    }}>
                                        <MdDelete />
                                    </button>
                                </td>


                            </tr>
                        )
                    })

                    }
                </tbody>

            </table>

            {
                openUpdateRole &&
                (
                    <ChangeUserRole
                        onClose={() => setOpenUpdateRole(false)}
                        name={updateUserDetails.name}
                        email={updateUserDetails.email}
                        role={updateUserDetails.role}
                        userId={updateUserDetails._id}
                        callFunc={fetchAllUsers}
                    />
                )
            }

            {openDeletePopup && selectedUserForDelete && (
                <DeleteUserPopup
                    onClose={() => setOpenDeletePopup(false)}
                    onConfirm={() => handleDeleteUser(selectedUserForDelete._id)}
                    name={selectedUserForDelete.name}
                />
            )}

        </div>
    )
}

export default AllUsers