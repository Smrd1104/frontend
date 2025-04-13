import React from 'react'
import image1 from "../assets/banner/img1.webp"
import image2 from "../assets/banner/img2.webp"
import image3 from "../assets/banner/img3.jpg"
import image4 from "../assets/banner/img4.jpg"
import image5 from "../assets/banner/img5.webp"

import image1Mobile from "../assets/banner/img1_mobile.jpg"
import image2Mobile from "../assets/banner/img2_mobile.webp"
import image3Mobile from "../assets/banner/img3_mobile.jpg"
import image4Mobile from "../assets/banner/img4_mobile.jpg"
import image5Mobile from "../assets/banner/img5_mobile.png"
import { useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useEffect } from 'react'

const BannerProduct = () => {

    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ];

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ];

    const nextImage = () => {

        if (desktopImages.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1)
        }

    }
    const prevImage = () => {

        if (currentImage != 0) {
            setCurrentImage(prev => prev - 1)
        }

    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [currentImage])

    return (
        <div className='container mx-auto p-4 rounded'>

            <div className='h-56 md:h-72 w-full bg-slate-200 relative'>

                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className=' flex justify-between w-full text-2xl'>

                        <button onClick={prevImage} className='bg-white shadow-md rounded-full p-1 cursor-pointer'><FaAngleLeft /></button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1 cursor-pointer'> <FaAngleRight /></button>
                    </div>

                </div>
                <div className='hidden md:flex w-full h-full overflow-hidden  '>
                    {desktopImages.map((imgURL, index) => (
                        <div className='w-full h-full min-w-full min-h-full  transition-all ' key={imgURL} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                            <img src={imgURL} className='w-full h-full object-cover' alt={`Banner Image ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {/* mobile version */}
                <div className='flex w-full h-full overflow-hidden md:hidden'>
                    {mobileImages.map((imgURL, index) => (
                        <div className='w-full h-full min-w-full min-h-full  transition-all ' key={imgURL} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                            <img src={imgURL} className='w-full h-full object-cover' alt={`Banner Image ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}

export default BannerProduct;
