import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import AdvertisingBanner from '../components/Advertise';
import advertise from '../advertise';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const adv = advertise.find(item => item.type === "BodyBanner");
  // const containerRefs = useRef([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 2;

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const getCategories = useCallback(() => {
    if (!data || !data.products) return [];
    return [...new Set(data.products.map(product => product.category))];
  }, [data]);

  const loadMoreCategories = useCallback(() => {
    const allCategories = getCategories();
    const newCategories = allCategories.slice(
      (currentPage - 1) * categoriesPerPage,
      currentPage * categoriesPerPage
    );
    setCategories(prevCategories => {
      const combinedCategories = [...prevCategories, ...newCategories];
      return [...new Set(combinedCategories)]; // Ensure no duplicate categories
    });
  }, [getCategories, currentPage, categoriesPerPage]);

  useEffect(() => {
    // Load initial categories
    if (data && data.products) {
      loadMoreCategories();
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, loadMoreCategories]);

  useEffect(() => {
    // Load more categories when the page number changes
    if (currentPage > 1) {
      loadMoreCategories();
    }
  }, [currentPage, loadMoreCategories]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
      // User has scrolled to the bottom, load more categories
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // const handleScrollButton = (scrollOffset, index) => {
  //   const container = containerRefs.current[index];
  //   if (container) {
  //     container.scrollLeft += scrollOffset;
  //   }
  // };

  return (
    <>
      {!keyword ? (
       <div className="mt-20">
       <AdvertisingBanner images={adv.images} height={adv.dimensions.height} width={adv.dimensions.width} />
     </div>
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div>
          <Meta />
          {categories.map((category, index) => (
            <div key={category} className="mt-4">
              <h3 className="text-xl font-semibold">{category}</h3>
              <div className="relative flex items-center">
                {/* <button 
                  className="absolute left-0 bg-green-500 text-white px-2 py-1 rounded-full focus:outline-none"
                  onClick={() => handleScrollButton(-100, index)}
                >
                  &lt;
                </button> */}
                <div className="ml-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {data.products
      .filter((product) => product.category === category)
      .map((product) => (
        <Product key={product._id} product={product} keyword={keyword} />
      ))}
  </div>
</div>

                {/* <button 
                  className="absolute right-0 bg-green-500 text-white px-2 py-1 rounded-full focus:outline-none"
                  onClick={() => handleScrollButton(100, index)}
                >
                  &gt;
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HomeScreen;
