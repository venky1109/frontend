import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Message from '../components/Message';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);

  const { data: productsData, error } = useGetProductsQuery({ keyword: '', pageNumber: 1 });

  useEffect(() => {
    if (productsData && productsData.products && keyword.trim().length >= 3) {
      const filteredProducts = productsData.products.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );

      const brandSuggestions = [];
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

      const formattedBrandSuggestions = brandSuggestions.map((brand) => ({
        name: brand,
        type: 'brand',
      }));

      setSuggestions([...filteredProducts, ...formattedBrandSuggestions]);
    } else {
      setSuggestions([]);
    }
  }, [keyword, productsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [keyword, suggestions]);

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?query=${keyword}`, { state: { suggestions } });
      setKeyword('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'brand') {
      navigate(`/search?query=${suggestion.name}`);
    } else {
      navigate(`/product/${suggestion.slug}`);
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
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setFocusedIndex((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
              );
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setFocusedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
              );
            } else if (e.key === 'Enter' && focusedIndex >= 0) {
              handleSuggestionClick(suggestions[focusedIndex]);
            }
          }}
          style={{ minHeight: '32px' }}
        />
        <button onClick={handleSearch} className="p-1 sm:p-2 text-gray-500">
          <FaSearch />
        </button>
      </div>

      {/* Error Message */}
      <div className="absolute top-12 left-0 right-0">
        {error && <Message variant="danger">{error?.data?.message || error.message}</Message>}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`p-2 cursor-pointer ${
                focusedIndex === index ? 'bg-gray-200 border border-gray-400 rounded-lg' : ''
              } ${suggestion.type === 'brand' ? 'text-yellow-600 font-semibold' : 'bg-white-200'}`}
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
                  <span><b>Category:</b> <i>{suggestion.category || 'Unknown'}</i></span>
                  <br />
                  <span><b>Brand:</b> <i>{suggestion.details?.map((d) => d.brand).filter(Boolean).join(', ') || 'Unknown'}</i></span>
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
