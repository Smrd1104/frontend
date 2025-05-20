import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import Ad from '../pages/Ad'
import UploadAdvertisement from '../components/UploadAdvertisement'

const Home = () => {
    return (
        <div>
            <CategoryList />
            <BannerProduct />




            <HorizontalCardProduct category={"airpods"} heading={"Top's Airpods"} />



            <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />

            <VerticalCardProduct category={"camera"} heading={"Camera products"} />
            <HorizontalCardProduct category={"earphones"} heading={"Top's Earphones"} />

            <VerticalCardProduct category={"mouse"} heading={"Accessories hardwares & Mouse"} />
            <div className='md:grid md:grid-cols-2 p-2 gap-5 items-center '>
                <Ad className="lg:block hidden" />
                <VerticalCardProduct category={"printers"} heading={"Accessories hardwares & printers"} />

            </div>
            <HorizontalCardProduct category={"camera"} heading={"Top's cameras"} />

            <div className='md:grid md:grid-cols-2 p-2 gap-5 items-center '>
                <VerticalCardProduct category={"processor"} heading={"Computer & Laptop processor"} />
                <Ad className="lg:block hidden" />
            </div>
            <VerticalCardProduct category={"refrigerator"} heading={"Home Appliances & Refrigerator"} />
            <HorizontalCardProduct category={"mobiles"} heading={"Top's mobiles"} />

            <div className='md:grid md:grid-cols-3 gap-5'>
                <VerticalCardProduct category={"speakers"} heading={"Home theatre speakers"} />
                <VerticalCardProduct category={"televisions"} heading={"LED & OLD TV's"} />
                <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />

            </div>
            <HorizontalCardProduct category={"trimmers"} heading={"Top's trimmers"} />

            <VerticalCardProduct category={"trimmers"} heading={"Shaving & trimmers"} />
            <VerticalCardProduct category={"watches"} heading={"Wrist Watches"} />

        </div>
    )
}

export default Home
