import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import Advertisement from './Advertisement';
import summaryApi from '../common';

const UploadMediaWithTitle = ({ onClose, onUploadSuccess, editData }) => {
    const [data, setData] = useState({ title: "", media: [] });
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize with edit data if available
    useEffect(() => {
        if (editData) {
            setData({
                title: editData.title || "",
                media: editData.media || []
            });
        }
    }, [editData]);

    const handleOnChange = (e) => {
        setData(prev => ({ ...prev, title: e.target.value }));
    };

    const handleUploadMedia = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const isVideo = file.type.startsWith("video/");
            const uploadImageCloudinary = await uploadImage(file);

            setData(prev => ({
                ...prev,
                media: [...prev.media, {
                    type: isVideo ? "video" : "image",
                    url: uploadImageCloudinary.url
                }]
            }));
        } catch (error) {
            console.error('Error uploading media:', error);
            alert('Failed to upload media. Please try again.');
        }
    };

    const handleDeleteMedia = (index) => {
        const updated = [...data.media];
        updated.splice(index, 1);
        setData(prev => ({ ...prev, media: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate data
        if (!data.title.trim()) {
            alert('Please enter a title');
            setIsSubmitting(false);
            return;
        }

        if (data.media.length === 0) {
            alert('Please upload at least one media file');
            setIsSubmitting(false);
            return;
        }

        try {
            const endpoint = editData
                ? `${summaryApi.adMedia.url}/${editData._id}`
                : summaryApi.adMedia.url;

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            console.log(editData ? 'Update success:' : 'Upload success:', result);
            if (typeof onUploadSuccess === "function") onUploadSuccess();
            if (typeof onClose === "function") onClose();

        } catch (error) {
            console.error('Request error:', error);
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed bg-slate-200/50 w-full h-full top-0 left-0 flex items-center justify-center z-50'>
            <div className='bg-white p-4 rounded overflow-y-scroll w-full max-w-xl h-full max-h-[80%] overflow-hidden'>
                <Advertisement />
                {data.media.length > 0 && (
                    <MediaPreview
                        media={data.media}
                        onDelete={handleDeleteMedia}
                        onImageClick={(url) => {
                            setFullScreenImage(url);
                            setOpenFullScreenImage(true);
                        }}
                    />
                )}

                <div className='flex items-center justify-between py-2'>
                    <h2 className='font-bold text-lg'>
                        {editData ? 'Edit Ad' : 'Upload New Ad'}
                    </h2>
                    <div
                        className='text-2xl hover:text-red-600 cursor-pointer'
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <CgClose />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='grid gap-3 p-4 overflow-y-auto h-[calc(80vh-100px)] scrollbar-thin'>
                    <label>Title:</label>
                    <input
                        name="title"
                        value={data.title}
                        onChange={handleOnChange}
                        required
                        className='p-2 bg-slate-100 border rounded'
                        disabled={isSubmitting}
                    />

                    <label>Upload Image or Video:</label>
                    <label htmlFor='uploadMediaInput'>
                        <div className='cursor-pointer p-2 bg-slate-100 border rounded h-32 flex items-center justify-center'>
                            <div className='text-slate-500 text-center'>
                                <FaCloudUploadAlt className='text-4xl mx-auto' />
                                <p className='text-sm'>Click to Upload</p>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    id="uploadMediaInput"
                                    className="hidden"
                                    onChange={handleUploadMedia}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </label>

                    <button
                        type="submit"
                        className='px-3 py-2 bg-red-600 text-white hover:bg-red-800 mt-2 disabled:bg-gray-400'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : editData ? 'Update Ad' : 'Upload Ad'}
                    </button>
                </form>
            </div>

            {openFullScreenImage && (
                <DisplayImage
                    imgUrl={fullScreenImage}
                    onClose={() => setOpenFullScreenImage(false)}
                />
            )}
        </div>
    );
};

const MediaPreview = ({ media = [], onDelete, onImageClick }) => {
    return (
        <div className='flex flex-wrap gap-2 px-4 pb-2'>
            {media.map((item, index) => (
                <div key={index} className='relative group w-32 h-36'>
                    {item.type === "image" ? (
                        <img
                            src={item.url}
                            alt={`media-${index}`}
                            className='w-full h-full object-cover border rounded cursor-pointer'
                            onClick={() => onImageClick(item.url)}
                        />
                    ) : (
                        <video
                            src={item.url}
                            className='w-full h-full object-cover border rounded'
                            controls
                        />
                    )}
                    <div
                        className='absolute bottom-1 right-1 text-white bg-red-500 p-1 rounded-full hidden group-hover:block cursor-pointer'
                        onClick={() => onDelete(index)}
                    >
                        <MdDelete />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UploadMediaWithTitle;