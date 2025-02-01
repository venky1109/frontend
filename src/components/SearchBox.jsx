import React, { useState, useEffect,useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Message from '../components/Message';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null); // Reference for detecting clicks outside

  // Fetch products from the backend
  const { data: productsData, error } = useGetProductsQuery({ keyword: '', pageNumber: 1 });

  useEffect(() => {
    if (productsData && productsData.products && keyword.trim().length >= 3) {
      let filteredProducts = productsData.products.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );

      // Extract unique brand names from product details
      let brandSuggestions = [];
      productsData.products.forEach((product) => {
        product.details.forEach((detail) => {
          if (
            detail.brand &&
            detail.brand.toLowerCase().includes(keyword.toLowerCase()) &&
            !brandSuggestions.includes(detail.brand)
          ) {
            brandSuggestions.push(detail.brand);
          }
        });
      });

      // Format brand suggestions separately
      const formattedBrandSuggestions = brandSuggestions.map((brand) => ({
        name: brand,
        type: 'brand', // To differentiate from product suggestions
      }));

      // Combine product and brand suggestions
      setSuggestions([...filteredProducts, ...formattedBrandSuggestions]);
    } else {
      setSuggestions([]);
    }
    
  }, [keyword, productsData]);
    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setSuggestions([]); // Close dropdown
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?query=${keyword}`, { state: { suggestions } });

      // Clear search box and suggestions
      setKeyword('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'brand') {
      navigate(`/search?query=${suggestion.name}`);
    } else {
      navigate(`/product/${suggestion._id}`);
    }

    setKeyword('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
      {/* Search Input */}
      <div className="flex items-center border border-gray-100 rounded-lg bg-white p-1 sm:p-2">
        <input
          type="text"
          className="flex-grow outline-none text-gray-700 text-sm sm:text-base p-1 sm:p-2"
          placeholder="Search for products or brands..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ minHeight: '32px' }}
        />
        <button onClick={handleSearch} className="p-1 sm:p-2 text-gray-500">
          <FaSearch />
        </button>
      </div>

      {/* Loader and Error Handling */}
      <div className="absolute top-12 left-0 right-0">
        {error && <Message variant="danger">{error?.data?.message || error.message}</Message>}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
        ref={dropdownRef}
  className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10 
  max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer ${
                suggestion.type === 'brand' ? 'text-yellow-600 font-semibold' : 'bg-gray-200'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSuggestionClick(suggestion);
                }
              }}
            >
          {suggestion.type === 'brand' ? (
    `Brand: ${suggestion.name}`
  ) : (
    <>
      <span><b>Category:</b><i> {suggestion.category || 'Unknown'}</i></span>
      <br />
      <span><b>Brand:</b> <i>{suggestion.details?.map((detail) => detail.brand).filter(Boolean).join(', ') || 'Unknown'}</i></span>
      <br />
      <span><b>Product:</b> <i>{suggestion.name}</i></span>
    </>
  )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
