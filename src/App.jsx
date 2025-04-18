import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';
import summaryApi from './common';
import Context from "./context/index"
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import { useState } from 'react';

function App() {

  const [cartProductCount, setCartProductCount] = useState(0)

  const dispatch = useDispatch()
  const fetchUserDetails = async () => {

    const dataResponse = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: "include",
    })

    const dataApi = await dataResponse.json()

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi?.data))
    } else {
      dispatch(setUserDetails(null))
    }


  }

  const fetchUserAddToCart = async () => {

    const dataResponse = await fetch(summaryApi.addToCartProductCount.url, {
      method: summaryApi.addToCartProductCount.method,
      credentials: "include",
    })

    const dataApi = await dataResponse.json()

    // console.log('dataApi ', dataApi);
    setCartProductCount(dataApi?.data?.count)



  }
  useEffect(() => {
    fetchUserDetails()

    // user details

    fetchUserAddToCart()
  }, [])

  return (
    <>

      <Context.Provider value={{ fetchUserDetails, cartProductCount, fetchUserAddToCart }}>
        <ToastContainer position='top-center' />
        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />

      </Context.Provider>

    </>
  )
}

export default App
