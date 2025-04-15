import React from 'react'
import { useLocation } from 'react-router-dom'
import summaryApi from '../common'
import { useEffect } from 'react'

const SearchProduct = () => {

    const query = useLocation()

    console.log('query', query.search);

    const fetchProduct = async () => {
        const response = await fetch(summaryApi.searchProduct.url + query.search)

        const responseData = await response.json()

        console.log('responseData', responseData);

        return responseData
    }

    useEffect(() => {
        fetchProduct()
    }, [query])

    console.log('query', query);
    return (
        <div>SearchProduct</div>
    )
}

export default SearchProduct