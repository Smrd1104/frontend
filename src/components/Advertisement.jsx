import img from '../assets/banner/img1_mobile.jpg'
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
                            src={`${item.url}.mp4`}
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


export default MediaPreview
