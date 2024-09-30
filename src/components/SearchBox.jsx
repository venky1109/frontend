import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
// import Loader from '../components/Loader'; 
import Message from '../components/Message'; 

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch products from the backend
  const { data: productsData, error } = useGetProductsQuery({ keyword: '', pageNumber: 1 });

  useEffect(() => {
    if (productsData && productsData.products && keyword.trim().length >= 3) {
      const filteredSuggestions = productsData.products.filter((product) => {
        const matchesProductName = product.name.toLowerCase().includes(keyword.toLowerCase());
        const matchesBrandName = product.details.some((detail) =>
          detail.brand.toLowerCase().includes(keyword.toLowerCase())
        );

        return matchesProductName || matchesBrandName;
      });

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [keyword, productsData]);

  const handleSearch = () => {
    if (keyword.trim()) {
      // If there are suggestions, navigate to the SearchScreen with the suggestions
      if (suggestions.length > 0) {
        navigate(`/search?query=${keyword}`, { state: { suggestions } });
      } else {
        // Navigate to the search screen even if there are no suggestions (for broader search)
        navigate(`/search?query=${keyword}`);
      }

      // Clear the search box and suggestions
      setKeyword('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Navigate to the selected product page
    navigate(`/product/${suggestion._id}`);

    // Clear the search box and suggestions
    setKeyword('');
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
      {/* Search Input */}
      <div className="flex items-center border border-gray-300 rounded-lg bg-white p-2">
        <input
          type="text"
          className="flex-grow outline-none text-gray-700 p-2"
          placeholder="Search for products or brands..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ minHeight: '40px' }} 
        />
        <button onClick={handleSearch} className="p-2 text-gray-500">
          <FaSearch />
        </button>
      </div>

      {/* Loader and Error Handling */}
      <div className="absolute top-12 left-0 right-0">
        {/* {isLoading && <Loader />} */}
        {error && <Message variant="danger">{error?.data?.message || error.message}</Message>}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)} // Handle suggestion click
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
