import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import SearchScreenCard from '../components/SearchScreenCard';

const SearchScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('query') || '';

  // Access the suggestions passed via location state
  const suggestions = useMemo(() => location.state?.suggestions || [], [location.state]);

  // Fetch products based on the search keyword if no suggestions passed
  const { data: searchResults, isLoading, error } = useGetProductsQuery(
    { keyword: searchKeyword, pageNumber: 1 },
    { skip: suggestions.length > 0 } // Skip fetching if suggestions are already provided
  );

  const products = suggestions.length > 0 ? suggestions : searchResults?.products || [];

  // Local state to track products added to cart
  const [productsInCart, setProductsInCart] = useState([]);

  useEffect(() => {
    // Retrieve the cart state from local storage or any other persistent storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setProductsInCart(cartItems);
  }, []);

  const handleAddToCart = (productId) => {
    // Add product ID to the productsInCart state
    setProductsInCart((prevState) => {
      const updatedCart = [...prevState, productId];
      localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Store in local storage
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    // Remove product ID from the productsInCart state
    setProductsInCart((prevState) => {
      const updatedCart = prevState.filter((id) => id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update local storage
      return updatedCart;
    });
  };

  return (
    <div className="mt-24">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : products.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Search Results for "{searchKeyword}"
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-6 sm:ml-0 mb-10 sm:mb-0">
  {products.map((product) => (
    <SearchScreenCard
      key={product._id}
      product={product}
      isInCart={productsInCart.includes(product._id)}
      onAddToCart={() => handleAddToCart(product._id)}
      onRemoveFromCart={() => handleRemoveFromCart(product._id)}
    />
  ))}
</div>


        </>
      ) : (
        <Message>No products found for "{searchKeyword}"</Message>
      )}
    </div>
  );
};

export default SearchScreen;
