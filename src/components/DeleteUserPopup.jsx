import React from "react";
import { MdClose } from "react-icons/md";

const DeleteUserPopup = ({ onClose, onConfirm, name }) => {
    return (
        <div className="fixed inset-0 bg-slate-200/50 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl text-center">

                <h2 className="text-xl font-semibold mb-4 ">Delete User</h2>
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    <MdClose />
                </button>
                <p className="mb-6">
                    Are you sure you want to delete <span className="font-bold">{name}</span>?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserPopup;
