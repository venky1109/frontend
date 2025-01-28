import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
// import { useFetchPromotionsQuery } from '../slices/promotionsAPISlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
// import advertise from '../advertise';
import homeConfig from '../HomeConfig.json';
import { useNavigate } from 'react-router-dom';
// import AdvertisingBanner from '../components/Advertise';
import Product from '../components/Product';
import AdvertiseSlider from "../components/AdvertiseSlider";


// Lazy load components to reduce initial bundle size
const CategoryCard = React.lazy(() => import('../components/CategoryCard'));
// const PromotionCard = React.lazy(() => import('../components/PromotionCard'));

const HomeScreen = () => {
  // const adv = advertise.find((item) => item.type === 'BodyBanner');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const scrollSpeed = 0; // Adjust scroll speed
  const navigate = useNavigate();
  const scrollIntervalRef = useRef(null);

  // Fetch all categories
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
  
  // Fetch all products
  // const { data: productsData, isLoading: isProductsLoading, error: productsError } = useGetProductsQuery({ keyword: '', pageNumber: 1 });
// Define the category name you want to filter by
const categoryName = 'BUDGET FRIENDLY PACKAGES';

// Fetch products by category directly using useGetProductsByCategoryQuery
const { data: productsData, isLoading: isProductsLoading, error: productsError } = useGetProductsByCategoryQuery(categoryName);

  // Fetch promotions using the generated hook
  // const { data: promotions } = useFetchPromotionsQuery();

  useEffect(() => {
    if (categoriesData && categoriesData.categories) {
      setCategories(categoriesData.categories);
    }
    // if (productsData && productsData.products) {
    //   const dailyNeedsProducts = productsData.products.filter(product => product.category === 'BUDGET FRIENDLY PACKAGES');
    //   setProducts(dailyNeedsProducts);
    //   console.log("Filtered daily needs products:", dailyNeedsProducts);
    //   // setProducts(productsData.products);
    // }
    // Set products directly from productsData for the specified category
  if (productsData && productsData.products) {
    setProducts(productsData.products);
    // console.log("Retrieved products for category:", categoryName, productsData.products);
  }
  }, [categoriesData, productsData]);

  // Define the auto-scroll function outside of useEffect
  const startAutoScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
    }, 20);
  }, [scrollSpeed]);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(scrollIntervalRef.current);
  }, [startAutoScroll]);

  const handleCategoryCardClick = useCallback((categoryName) => {
    navigate(`/category/${categoryName}`);
  }, [navigate]);

  // const handleCardClick = useCallback((promotion) => {
  //   const categoryId = promotion.categoryId || 'default-category';
  //   navigate(`/category/${categoryId}`);
  // }, [navigate]);

  const getCategoryImage = useCallback((categoryName) => {
    const categoryCustomization = homeConfig.sections
      .find((section) => section.type === 'category')
      ?.customization.categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
    return categoryCustomization
      ? categoryCustomization.image
      : 'https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/Baking_needs_300.png?alt=media&token=c1707f2a-92ab-46c5-b219-936b559cb6f2';
  }, []);

  const categorySection = homeConfig.sections.find(
    (section) => section.type === 'category'
  );
  const categoryTitle = categorySection ? categorySection.title : 'Categories';

  return (
    <>
      {/* <div className="mt-20">
        <AdvertisingBanner
          images={adv.images}
          height={adv.dimensions.height}
          width={adv.dimensions.width}
        />
      </div> */}
   

   <div className="container mx-auto  md:py-12 mt-24">
  <div className="flex items-stretch justify-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8">
  {/* <ShineEffectTest/> */}
  <div className="relative overflow-hidden bg-gradient-to-r from-green-300 via-green-500 to-green-800 rounded-md p-6 w-11/12 md:w-8/12 lg:w-6/12 mx-auto">
      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-red text-3xl font-semibold mb-2">
          Exciting Offers on Sri Maha Lakshmi Raitu Dairy Products
        </h1>
        <p className="text-white text-lg">
          Sample offers <span className="font-bold">discount percentage</span>
        </p>
        <button className="mt-4 bg-white text-[rgb(33,180,201)] font-bold py-2 px-4 rounded hover:bg-gray-100 transition-all duration-300">
          Order Now
        </button>
      </div>
    </div>




    {/* Second Section */}
    <div className="rounded-md md:w-4/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 bg-[rgb(34,197,94)] dark:bg-[rgb(34,197,94)] py-6 px-6 md:py-0 md:px-4 lg:px-6 flex flex-col justify-center relative">
  <div className="flex flex-col justify-center">
    <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white">
      BUDGET FRIENDLY PACKS
    </h1>
    <p className="text-base lg:text-xl text-gray-800 dark:text-white">
      Save Upto <span className="font-bold">33%</span>
    </p>
    {/* Order Now Button */}
    <button
      onClick={() => handleCategoryCardClick("BUDGET FRIENDLY PACKAGES")}
      className="mt-4 bg-white text-[rgb(34,197,94)] font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors duration-300"
    >
      Order Now
    </button>
  </div>
</div>

  </div>
</div>




<AdvertiseSlider />




      {isCategoriesLoading || isProductsLoading ? (
        <Loader />
      ) : categoriesError || productsError ? (
        <Message variant="danger">
          {categoriesError?.data?.message ||
            productsError?.data?.message ||
            categoriesError?.error ||
            productsError?.error}
        </Message>
      ) : (
        <div className="mt-4 mb-24">
          <h5 className="text-xl font-serif text-green-800 mt-8 semi-bold">
            {categoryTitle.toUpperCase()}
          </h5>

          <React.Suspense fallback={<Loader />}>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 rounded-md  gap-x-0 pt-3 pb-3 pl-2 pr-2">
              {categories.map((category) => (
                <CategoryCard
                  key={category}
                  name={category}
                  image={getCategoryImage(category)}
                  onClick={() => handleCategoryCardClick(category)}
                  className="p-0 sm:p-0 lg:p-1"
                />
              ))}
            </div>
          </React.Suspense>

          <h5 className="text-xl font-serif text-green-800 mb-4 mt-8 mb-0 semi-bold">
          MK BUDGET FRIENDLY PACKS
          </h5>

          <React.Suspense fallback={<Loader />}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1 bg-gray-200 rounded-md p-1">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </React.Suspense>
        </div>
      )}
    </>
  );
};

export default HomeScreen;
