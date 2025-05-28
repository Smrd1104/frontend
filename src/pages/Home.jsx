import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import Ad from '../pages/Ad'
import UploadAdvertisement from '../components/UploadAdvertisement'
import SearchNavbarMobile from '../components/SearchNavbarMobile'
import ProductAd from '../components/ProductAd'

const Home = () => {
    return (
        <div>
            <SearchNavbarMobile />
            <CategoryList />
            <BannerProduct />
            <div className='md:grid md:grid-cols-[1000px_1fr] container mx-auto '>
                <div className='flex flex-col  items-center  '>
                    <ProductAd />
                    <ProductAd reverseOrder={true} />

                </div>
                <div className='p-2'>
                    <Ad />
                </div>
            </div>



            <HorizontalCardProduct category={"airpods"} heading={"Top's Airpods"} />



            <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />

            <VerticalCardProduct category={"camera"} heading={"Camera products"} />
            <HorizontalCardProduct category={"earphones"} heading={"Top's Earphones"} />

            <VerticalCardProduct category={"mouse"} heading={"Accessories hardwares & Mouse"} />
            <div className='md:grid md:grid-cols-[300px_1fr] p-2 gap-5 items-center mx-auto container '>
                <Ad className="lg:block hidden" />
                <VerticalCardProduct category={"printers"} heading={"Accessories hardwares & printers"} />

            </div>
            <HorizontalCardProduct category={"camera"} heading={"Top's cameras"} />

            <div className='md:grid md:grid-cols-[1000px_1fr] p-2 gap-5 items-center mx-auto container '>
                <VerticalCardProduct category={"processor"} heading={"Computer & Laptop processor"} />
                <Ad className="lg:block hidden" />
            </div>
            <VerticalCardProduct category={"refrigerator"} heading={"Home Appliances & Refrigerator"} />
            <HorizontalCardProduct category={"mobiles"} heading={"Top's mobiles"} />


            <VerticalCardProduct category={"speakers"} heading={"Home theatre speakers"} />
            <VerticalCardProduct category={"televisions"} heading={"LED & OLD TV's"} />
            <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />


            <HorizontalCardProduct category={"trimmers"} heading={"Top's trimmers"} />

            <VerticalCardProduct category={"trimmers"} heading={"Shaving & trimmers"} />
            <VerticalCardProduct category={"watches"} heading={"Wrist Watches"} />
            {/* <VerticalCardProduct category={"mehndi"} heading={"Mehndi"} />
            <VerticalCardProduct category={"saree"} heading={"Saree"} /> */}



        </div>
    )
}

export default Home
