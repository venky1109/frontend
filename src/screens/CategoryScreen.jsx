// src/screens/CategoryScreen.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery, useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryScreen = () => {
  const { categoryName } = useParams(); // Get the category name from the URL
  console.log('Category Name from URL:', categoryName);

  // Fetch all products
  const { data: allProductsData, isLoading: isAllProductsLoading, error: allProductsError } = useGetProductsQuery();

  // Fetch products by category
  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError } = useGetProductsByCategoryQuery(categoryName);

  // Determine if we should show all products or filtered by category
  const isLoading = categoryName === 'all' ? isAllProductsLoading : isCategoryLoading;
  const error = categoryName === 'all' ? allProductsError : categoryError;
  const products = categoryName === 'all' ? allProductsData?.products : categoryData?.products;

  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className='mb-24'>
          <h2 className="text-3xl font-serif text-green-800 mt-24 m-4 semi-bold">
            {categoryName === 'all' ? 'All Products' : categoryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products && products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryScreen;
