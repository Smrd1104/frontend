import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import UploadMediaWithTitle from './UploadAdvertisement';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const AdminAds = ({ data, fetchData }) => {
    const [editAds, setEditAds] = useState(false);

    const handleDelete = async () => {
        try {
            const { url, method } = summaryApi.deleteAd(data._id); // ✅ Only call once
            console.log("Deleting ad with:", url, method);

            const response = await fetch(url, { method });

            const result = await response.json();

            if (response.ok) {
                fetchData(); // ✅ Refresh the ad list
                toast.success('Ad deleted successfully')

            } else {
                console.error('Failed to delete ad:', result.error);
                alert(result.error || 'Failed to delete ad');
            }
        } catch (error) {
            console.error('Error deleting ad:', error);
            alert('Something went wrong while deleting the ad.');
        }
    };



    return (
        <>
            <div className="w-72 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ">
                <div className="w-full h-32 flex justify-center items-center mx-auto">
                    {data?.media[0]?.type === 'image' ? (
                        <img
                            src={data?.media[0].url}
                            alt="ad"
                            width={120}
                            height={120}
                            className="mx-auto object-cover h-full rounded"
                        />
                    ) : data?.media[0]?.type === 'video' ? (
                        <video
                            src={data?.media[0].url}
                            controls
                            className="mx-auto object-cover h-full w-full rounded"
                        >
                            <source src={data?.media[0].url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p>No media</p>
                    )}
                </div>

                <h1 className="text-ellipsis line-clamp-2 mt-2 text-center text-sm font-medium">
                    {data?.title || 'Untitled'}
                </h1>

                <div className="mt-2 flex justify-between">
                    <div
                        className="cursor-pointer p-2 bg-red-500 hover:bg-red-700 rounded-full text-white"
                        onClick={handleDelete}
                    >
                        <MdDelete size={14} />
                    </div>
                    <div
                        className="cursor-pointer p-2 bg-green-500 hover:bg-green-700 rounded-full text-white"
                        onClick={() => setEditAds(true)}
                    >
                        <MdModeEditOutline size={14} />
                    </div>
                </div>
            </div>

            {editAds && (
                <UploadMediaWithTitle
                    onClose={() => setEditAds(false)}
                    onUploadSuccess={fetchData}
                    editData={data}
                />
            )}
        </>
    );
};

export default AdminAds;