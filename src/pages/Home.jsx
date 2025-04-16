import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

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
            <VerticalCardProduct category={"printers"} heading={"Accessories hardwares & printers"} />
            <HorizontalCardProduct category={"camera"} heading={"Top's cameras"} />

            <VerticalCardProduct category={"processor"} heading={"Computer & Laptop processor"} />
            <VerticalCardProduct category={"refrigerator"} heading={"Home Appliances & Refrigerator"} />
            <HorizontalCardProduct category={"mobiles"} heading={"Top's mobiles"} />

            <VerticalCardProduct category={"speakers"} heading={"Home theatre speakers"} />
            <VerticalCardProduct category={"televisions"} heading={"LED & OLD TV's"} />
            <HorizontalCardProduct category={"trimmers"} heading={"Top's trimmers"} />

            <VerticalCardProduct category={"trimmers"} heading={"Shaving & trimmers"} />
            <VerticalCardProduct category={"watches"} heading={"Wrist Watches"} />


        </div>
    )
}

export default Home
