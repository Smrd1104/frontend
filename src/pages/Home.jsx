import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'

const Home = () => {
    return (
        <div>
            <CategoryList />
            <BannerProduct />

            <HorizontalCardProduct category={"airpods"} heading={"Top's Airpods"} />
            <HorizontalCardProduct category={"earphones"} heading={"Top's Earphones"} />
            {/* <HorizontalCardProduct category={"camera"} heading={"Top's Camera"} />
            <HorizontalCardProduct category={"mobiles"} heading={"Top's mobiles"} />
            <HorizontalCardProduct category={"mouse"} heading={"Top's mouse"} />
            <HorizontalCardProduct category={"printers"} heading={"Top's printers"} />
            <HorizontalCardProduct category={"processor"} heading={"Top's processor"} />
            <HorizontalCardProduct category={"refrigerator"} heading={"Top's refrigerator"} />
            <HorizontalCardProduct category={"speakers"} heading={"Top's speakers"} />
            <HorizontalCardProduct category={"televisions"} heading={"Top's televisions"} />
            <HorizontalCardProduct category={"trimmers"} heading={"Top's trimmers"} />
            <HorizontalCardProduct category={"watches"} heading={"Top's watches"} /> */}


        </div>
    )
}

export default Home
