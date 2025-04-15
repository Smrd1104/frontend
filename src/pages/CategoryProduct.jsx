import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import productCategory from "../helpers/productCategory"
import { useState } from 'react'
import VerticalCard from "../components/VerticalCard"
import { useEffect } from 'react'
import summaryApi from '../common'
const CategoryProduct = () => {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const [sortBy, setSortBy] = useState("")
  console.log('sortBy: ', sortBy);
  const navigate = useNavigate()
  const [selectCategory, SetSelectCategory] = useState({})
  const [filterCategoryList, setFilterCategoryList] = useState([])
  const location = useLocation()
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListArray = urlSearch.getAll("category")

  const urlCategoryListObject = {}

  urlCategoryListArray.forEach(el => {
    urlCategoryListObject[el] = true

  })
  console.log('urlCategoryListObject: ', urlCategoryListObject);
  console.log("urlCategoryListArray", urlCategoryListArray)
  const params = useParams()

  const fetchData = async () => {
    const response = await fetch(summaryApi.filterProduct.url, {
      method: summaryApi.filterProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        category: filterCategoryList
      })
    })

    const dataResponse = await response.json()
    setData(dataResponse?.data || [])
  }


  const handleSelectCategory = (e) => {
    const { name, value, checked } = e.target;

    SetSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  }


  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  useEffect(() => {

    const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
      if (selectCategory[categoryKeyName]) {
        return categoryKeyName;
      }
      return null
    }).filter(el => el)
    setFilterCategoryList(arrayOfCategory)

    // format for url change when change on the check box
    const urlFormat = arrayOfCategory.map((el, index) => {

      if ((arrayOfCategory.length - 1) === index) {
        return `category=${el}`

      }
      return `category=${el}&& `
    })

    navigate("/product-category?" + urlFormat.join(""))
  }, [selectCategory])

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target

    setSortBy(value)

    if (value === 'asc') {
      setData(prev => prev.sort((a, b) => a.sellingPrice - b.sellingPrice))
    }
    if (value === 'dsc') {
      setData(prev => prev.sort((a, b) => b.sellingPrice - a.sellingPrice))
    }
  }


  useEffect(()=>{

  },[sortBy])


  return (
    // <div>{params?.categoryName}</div>
    <div className='container mx-auto p-4'>
      {/* desktop version */}
      <div className='hidden lg:grid grid-cols-[200px_1fr] gap-10'>
        {/* left side */}
        <div className='p-2 bg-white min-h-[calc(100vh-120px)] overflow-y-scroll '>
          {/* sort by */}
          <div>
            <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>sort by</h2>

            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sort' checked={sortBy === 'asc'} value={'asc'} onChange={handleOnChangeSortBy} />
                <label>Price - Low to High</label>
              </div>
              <div className='flex items-center gap-3'>
                <input type='radio' name='sort' value={"dsc"} checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>
          {/* filter by */}
          <div>
            <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>Category</h2>

            <form className='text-sm flex flex-col gap-2 py-2'>
              {
                productCategory.map((categoryName, index) => {
                  return (
                    <div key={index} className='flex items-center gap-3'>
                      <input type='checkbox' name={'category'} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                      <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                    </div>
                  )
                })
              }
            </form>
          </div>


        </div>
        {/* right side product */}
        <div className='p-4'>
          <p className='font-medium text-slate-800 text-lg my-2 '>Search Result:{data?.length}</p>
          <div className=' min-h-[calc(100vh-120px)] overflow-y-scroll  max-h-[calc(100vh-120px)] '>
            {
              data?.length !== 0 && !loading && (
                <VerticalCard data={data} loading={loading} />
              )
            }
          </div>

          {/* {
            params?.categoryName && (
              <CategoryWiseProductDisplay category={params?.categoryName} heading={"Recommended Products "} />
            )
          } */}
        </div>
      </div>

    </div>
  )
}

export default CategoryProduct