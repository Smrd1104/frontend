import React from 'react'
import { useLocation } from 'react-router-dom'
import summaryApi from '../common'
import { useEffect } from 'react'
import { useState } from 'react'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const query = useLocation()

    console.log('query', query.search);

    const fetchProduct = async () => {
        setLoading(true)
        const response = await fetch(summaryApi.searchProduct.url + query.search)

        const responseData = await response.json()
        setLoading(false)

        setData(responseData?.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [query])

    console.log('query', query);
    return (
        <div className='container mx-auto p-4'>
            {
                loading &&
                (
                    < p className='text-lg text-center' > Loading ...</p>
                )
            }
            < p className='text-lg  font-medium my-3'> Search Results: {data.length}</p>

            {
                data?.length === 0 && !loading && (
                    <p className='text-lg text-center bg-white p-4'>No Data Found ... </p>
                )
            }

            {
                data?.length !== 0 && !loading && (

                    <VerticalCard loading={loading} data={data} />
                )
            }

        </div >
    )
}

export default SearchProduct