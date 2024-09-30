

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsByCategoryQuery, useGetProductsQuery } from '../slices/productsApiSlice';
import CategoryScreenCard from '../components/CategoryScreenCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryScreen = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const { data: allProductsData, isLoading: isAllProductsLoading, error: allProductsError } = useGetProductsQuery();
  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError } = useGetProductsByCategoryQuery(categoryName);

  const isLoading = categoryName === 'all' ? isAllProductsLoading : isCategoryLoading;
  const error = categoryName === 'all' ? allProductsError : categoryError;
  const products = categoryName === 'all' ? allProductsData?.products : categoryData?.products;

  // Local state to track products added to cart
  const [productsInCart, setProductsInCart] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Retrieve the cart state from local storage or any other persistent storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setProductsInCart(cartItems);
  }, []);

  const goBackHandler = () => {
    navigate(-1);
  };

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
    <>
      {isLoading ? (
         <div >
        <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className='mt-24'>
          <button onClick={goBackHandler} className="text-green-600 hover:text-green-800 p-2 border border-green-600 rounded mb-4 inline-block">
            Go Back
          </button>
          <h2 className="text-3xl font-serif text-green-800 m-4 semi-bold">
            {categoryName === 'all' ? 'All Products' : categoryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ml-6 sm:ml-0 mb-10 sm:mb-0">
            {products && products.map((product) => (
              <CategoryScreenCard
                key={product._id}
                product={product}
                isInCart={productsInCart.includes(product._id)}
                onAddToCart={() => handleAddToCart(product._id)}
                onRemoveFromCart={() => handleRemoveFromCart(product._id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryScreen;

