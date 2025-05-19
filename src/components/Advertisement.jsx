import img from '../assets/banner/img1_mobile.jpg'
const Advertisement = () => {
    return (
        <div>
            <img src={img} className='md:w-[600px] md:h-[470px] lg:block hidden' />
        </div>
    )
}

export default Advertisement