import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import summaryApi from '../common';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectCategory, setSelectCategory] = useState({});
  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync checkbox state from URL on load or change
  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListArray = urlSearch.getAll("category");

    const initialCategoryState = {};
    urlCategoryListArray.forEach(el => {
      initialCategoryState[el] = true;
    });

    setSelectCategory(initialCategoryState);
    setFilterCategoryList(urlCategoryListArray);
  }, [location.search]);

  // Debounced update for selected categories and URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      const selected = Object.keys(selectCategory).filter(key => selectCategory[key]);
      setFilterCategoryList(selected);

      const queryString = selected.map(cat => `category=${cat}`).join('&');
      navigate(`/product-category${queryString ? '?' + queryString : ''}`, { replace: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [selectCategory, navigate]);

  // Fetch filtered products when category list changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(summaryApi.filterProduct.url, {
          method: summaryApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: filterCategoryList }),
        });
        const dataResponse = await response.json();
        setData(dataResponse?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (filterCategoryList.length > 0) {
      fetchData();
    }
  }, [filterCategoryList]);

  // Sort products by selected price order
  useEffect(() => {
    if (!sortBy || data.length === 0) return;

    const sorted = [...data].sort((a, b) =>
      sortBy === 'asc' ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
    );
    setData(sorted);
  }, [sortBy]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory(prev => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleOnChangeSortBy = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='hidden lg:grid grid-cols-[200px_1fr] gap-10'>
        {/* Left Filter Section */}
        <div className='p-2 bg-white min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none'>
          {/* Sort By */}
          <div>
            <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>Sort By</h2>
            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input
                  type='radio'
                  name='sort'
                  checked={sortBy === 'asc'}
                  value='asc'
                  onChange={handleOnChangeSortBy}
                />
                <label>Price - Low to High</label>
              </div>
              <div className='flex items-center gap-3'>
                <input
                  type='radio'
                  name='sort'
                  value='dsc'
                  checked={sortBy === 'dsc'}
                  onChange={handleOnChangeSortBy}
                />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>

          {/* Category Filter */}
          <div>
            <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>Category</h2>
            <form className='text-sm flex flex-col gap-2 py-2'>
              {productCategory.map((categoryName, index) => (
                <div key={index} className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    name='category'
                    checked={!!selectCategory[categoryName.value]}
                    value={categoryName.value}
                    id={categoryName.value}
                    onChange={handleSelectCategory}
                  />
                  <label htmlFor={categoryName.value}>{categoryName.label}</label>
                </div>
              ))}
            </form>
          </div>
        </div>

        {/* Right Product Section */}
        <div className='p-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>
            Search Result: {data?.length}
          </p>

          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none max-h-[calc(100vh-120px)]'>
            {loading ? (
              <div className="text-center py-10 text-slate-500 animate-pulse">Loading products...</div>
            ) : data?.length > 0 ? (
              <VerticalCard data={data} loading={loading} />
            ) : (
              <p className="text-slate-500 text-center py-10">No products found for the selected categories</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;




// import React from 'react'
// import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import productCategory from "../helpers/productCategory"
// import { useState } from 'react'
// import VerticalCard from "../components/VerticalCard"
// import { useEffect } from 'react'
// import summaryApi from '../common'

// const CategoryProduct = () => {
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [sortBy, setSortBy] = useState("")
//   const navigate = useNavigate()
//   const [selectCategory, setSelectCategory] = useState({})
//   const [filterCategoryList, setFilterCategoryList] = useState([])
//   const location = useLocation()

//   useEffect(() => {
//     // Parse URL parameters when component mounts or location changes
//     const urlSearch = new URLSearchParams(location.search)
//     const urlCategoryListArray = urlSearch.getAll("category")

//     // Create an object with categories from URL set to true
//     const initialCategoryState = {}
//     urlCategoryListArray.forEach(el => {
//       initialCategoryState[el] = true
//     })

//     setSelectCategory(initialCategoryState)
//     setFilterCategoryList(urlCategoryListArray)
//   }, [location.search])

//   const fetchData = async () => {
//     setLoading(true)
//     const response = await fetch(summaryApi.filterProduct.url, {
//       method: summaryApi.filterProduct.method,
//       headers: {
//         "content-type": "application/json"
//       },
//       body: JSON.stringify({
//         category: filterCategoryList
//       })
//     })

//     const dataResponse = await response.json()
//     setData(dataResponse?.data || [])
//     setLoading(false)
//   }

//   const handleSelectCategory = (e) => {
//     const { value, checked } = e.target;
//     setSelectCategory(prev => ({
//       ...prev,
//       [value]: checked,
//     }));
//   }

//   useEffect(() => {
//     if (filterCategoryList.length > 0) {
//       fetchData()
//     }
//   }, [filterCategoryList])

//   useEffect(() => {
//     const arrayOfCategory = Object.keys(selectCategory)
//       .filter(categoryKeyName => selectCategory[categoryKeyName])

//     setFilterCategoryList(arrayOfCategory)

//     // Update URL when categories change
//     if (arrayOfCategory.length > 0) {
//       const queryString = arrayOfCategory.map(cat => `category=${cat}`).join('&')
//       navigate(`/product-category?${queryString}`, { replace: true })
//     } else {
//       navigate('/product-category', { replace: true })
//     }
//   }, [selectCategory])

//   const handleOnChangeSortBy = (e) => {
//     const { value } = e.target
//     setSortBy(value)

//     if (value === 'asc') {
//       setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice))
//     }
//     if (value === 'dsc') {
//       setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice))
//     }
//   }

//   return (
//     <div className='container mx-auto p-4'>
//       <div className='hidden lg:grid grid-cols-[200px_1fr] gap-10'>
//         {/* left side */}
//         <div className='p-2 bg-white min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none '>
//           {/* sort by */}
//           <div>
//             <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>sort by</h2>
//             <form className='text-sm flex flex-col gap-2 py-2'>
//               <div className='flex items-center gap-3'>
//                 <input type='radio' name='sort' checked={sortBy === 'asc'} value={'asc'} onChange={handleOnChangeSortBy} />
//                 <label>Price - Low to High</label>
//               </div>
//               <div className='flex items-center gap-3'>
//                 <input type='radio' name='sort' value={"dsc"} checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} />
//                 <label>Price - High to Low</label>
//               </div>
//             </form>
//           </div>
//           {/* filter by */}
//           <div>
//             <h2 className='uppercase text-base border-b border-slate-400 font-md text-slate-500'>Category</h2>
//             <form className='text-sm flex flex-col gap-2 py-2'>
//               {productCategory.map((categoryName, index) => (
//                 <div key={index} className='flex items-center gap-3'>
//                   <input
//                     type='checkbox'
//                     name='category'
//                     checked={!!selectCategory[categoryName.value]}
//                     value={categoryName.value}
//                     id={categoryName.value}
//                     onChange={handleSelectCategory}
//                   />
//                   <label htmlFor={categoryName.value}>{categoryName.label}</label>
//                 </div>
//               ))}
//             </form>
//           </div>
//         </div>

//         {/* right side product */}
//         <div className='p-4'>
//           <p className='font-medium text-slate-800 text-lg my-2'>
//             Search Result: {data?.length}
//           </p>
//           <div className='min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none max-h-[calc(100vh-120px)]'>
//             {loading ? (
//               <p>Loading...</p>
//             ) : data?.length > 0 ? (
//               <VerticalCard data={data} loading={loading} />
//             ) : (
//               <p>No products found for the selected categories</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CategoryProduct