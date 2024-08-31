// src/screens/CategoryScreen.js
import React ,{useEffect}from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryScreen = () => {
  const { categoryName } = useParams(); // Get the category name from the URL
  console.log('Category Name from URL:', categoryName);
  const { data, isLoading, error } = useGetProductsByCategoryQuery(categoryName);
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
        <><h2 className="text-3xl font-serif text-green-800  mt-24 mb-4 semi-bold">
                          {categoryName} 
                      </h2><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                              {data.products
                                  .map((product) => (
                                      <Product key={product._id} product={product} />
                                  ))}
                          </div></>

      )}
    </>
  );
};

export default CategoryScreen;
