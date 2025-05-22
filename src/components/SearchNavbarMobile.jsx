import React, { useState, useEffect, useRef } from 'react';
import { GrSearch } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import summaryApi from '../common';

// Replace with your actual API base URL


const SearchNavbarMobile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("q") || "";

    const [search, setSearch] = useState(initialQuery);
    const [debouncedSearch] = useDebounce(search, 300);
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const menuRef = useRef(null);

    // Load recent products and searches on mount
    useEffect(() => {
        const savedRecentProducts = localStorage.getItem('recentProducts');
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedRecentProducts) setRecentProducts(JSON.parse(savedRecentProducts));
        if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch products on search
    useEffect(() => {
        const fetchSearchResults = async () => {
            const query = debouncedSearch.trim();
            if (!query) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            try {
                const res = await fetch(`${summaryApi.searchProduct.url}?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (res.ok) {
                    setSearchResults(data?.data || []);
                    setShowDropdown(true);

                    // Save term to recent searches
                    if (!recentSearches.includes(query)) {
                        const updatedSearches = [query, ...recentSearches].slice(0, 5);
                        setRecentSearches(updatedSearches);
                        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
                    }
                } else {
                    setSearchResults([]);
                    setShowDropdown(false);
                }
            } catch (err) {
                console.error("Search failed:", err);
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        fetchSearchResults();
    }, [debouncedSearch]);

    const handleProductClick = (product) => {
        const updatedProducts = [product, ...recentProducts.filter(p => p._id !== product._id)].slice(0, 5);
        setRecentProducts(updatedProducts);
        localStorage.setItem("recentProducts", JSON.stringify(updatedProducts));

        setSearch('');
        setSearchResults([]);
        setShowDropdown(false);
        navigate(`/product/${product._id}`);
    };

    return (
        <div className='w-full fixed top-16  z-40'>
            <div ref={menuRef} className="relative mx-auto ">
                <div className="relative  bg-white block md:hidden items-center py-3 px-2 w-full max-w-lg border border-gray-400 rounded focus-within:border-red-500 focus-within:shadow-md">
                    <input
                        type="text"
                        placeholder="Search products here..."
                        className="w-full outline-none pl-2 py-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => {
                            if (!search && (recentSearches.length > 0 || recentProducts.length > 0)) {
                                setShowDropdown(true);
                            }
                        }}
                    />
                    <div className="text-lg min-w-[50px] text-red-500 flex items-center justify-center absolute top-5  right-2">
                        <GrSearch />
                    </div>

                    {showDropdown && (
                        <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded z-50 max-h-120 overflow-y-auto scrollbar-none ">
                            {search ? (
                                searchResults.length > 0 ? (
                                    <>
                                        <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">Search Results</li>
                                        {searchResults.map(product => (
                                            <li
                                                key={product._id}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div className="flex gap-2 items-center">
                                                    <img src={product.productImage[0]} alt="" className="w-10 h-10 object-cover rounded" />
                                                    {product.productName}
                                                </div>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    <li className="px-4 py-2 text-gray-500">No results found</li>
                                )
                            ) : (
                                <>
                                    {recentProducts.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">Recently Viewed</li>
                                            {recentProducts.map((product, index) => (
                                                <li
                                                    key={`recent-product-${index}`}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    <div className="flex gap-2 items-center">
                                                        <img src={product.productImage[0]} alt="" className="w-10 h-10 object-cover rounded" />
                                                        {product.productName}
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                    {recentSearches.length > 0 && (
                                        <>
                                            <li className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100">Recent Searches</li>
                                            {recentSearches.map((term, index) => (
                                                <li
                                                    key={`term-${index}`}
                                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <span
                                                        onClick={() => {
                                                            setSearch(term);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        🔄 {term}
                                                    </span>
                                                    {/* <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const updated = recentSearches.filter((_, i) => i !== index);
                                                            setRecentSearches(updated);
                                                            localStorage.setItem("recentSearches", JSON.stringify(updated));
                                                        }}
                                                        className="text-red-500 hover:text-red-700 font-bold ml-2"
                                                        aria-label={`Remove ${term}`}
                                                    >
                                                        ×
                                                    </button> */}
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchNavbarMobile;
