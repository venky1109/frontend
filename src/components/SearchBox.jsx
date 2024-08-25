import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import { useNavigate } from 'react-router-dom';
import suggestionsData from '../suggestions.json'; // Import the flat file

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (keyword.trim().length >= 3) {
      const filteredSuggestions = suggestionsData
        .filter((suggestion) =>
          suggestion.toLowerCase().includes(keyword.toLowerCase())
        )
        .slice(0, 4); // Trim suggestions to 4
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if less than 3 characters
    }
  }, [keyword]);

  const submitHandler = (e) => {
    if (e) e.preventDefault();

    let searchQuery = keyword.trim();

    if (!searchQuery) {
      if (suggestions.length > 0) {
        searchQuery = suggestions[0];
      } else {
        return; // Do nothing if no keyword and no suggestions
      }
    }


    navigate(`/search/${searchQuery}`);
    setKeyword(''); // Clear the input field after submission
    setSuggestions([]); // Clear suggestions after submission
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(''); // Clear the keyword when a suggestion is clicked
    setSuggestions([]); // Clear suggestions after click
    navigate(`/search/${suggestion}`);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={submitHandler} className="flex items-center w-full">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700" />
          <input
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            placeholder="Search Groceries..."
            className="w-full sm:w-80 md:w-96 lg:w-[32rem] pl-10 px-10 py-2 border-2 border-gray-200 rounded-md focus:outline-none"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitHandler(e);
              }
            }}
          />
        </div>
      </form>
      {/* Render suggestions */}
      {keyword !== '' && suggestions.length > 2 && (
        <ul className="absolute left-0 mt-1 w-full sm:w-80 md:w-96 lg:w-[32rem] bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
