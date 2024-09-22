// src/screens/HomeScreen.js
import React, { useEffect, useState, useRef,Suspense  } from 'react';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice'; // Import the hook to fetch all products
import { useFetchPromotionsQuery } from '../slices/promotionsAPISlice'
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
// import AdvertisingBanner from '../components/Advertise';
import advertise from '../advertise';
import homeConfig from '../HomeConfig.json'; // Import JSON configuration
// import PromotionCard from '../components/PromotionCard';
// import Product from '../components/Product'; // Import Product component for displaying products
const AdvertisingBanner = React.lazy(() => import('../components/Advertise'));
const PromotionCard = React.lazy(() => import('../components/PromotionCard'));
const Product = React.lazy(() => import('../components/Product'));

const HomeScreen = () => {
  const adv = advertise.find((item) => item.type === 'BodyBanner');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const scrollSpeed = 0; // Adjust scroll speed

  // Store interval in a ref to make it accessible in functions
  const scrollIntervalRef = useRef(null);

  // Fetch all categories
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
  
  // Fetch all products
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useGetProductsQuery({ keyword: '', pageNumber: 1 });

  // Fetch promotions using the generated hook
  const { data: promotions } = useFetchPromotionsQuery();

  useEffect(() => {
    if (categoriesData && categoriesData.categories) {
      setCategories(categoriesData.categories);
    }
    if (productsData && productsData.products) {
      setProducts(productsData.products);
    }
  }, [categoriesData, productsData]);

  // Define the auto-scroll function outside of useEffect
  const startAutoScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    scrollIntervalRef.current = setInterval(() => {
      if (scrollContainer) {
        // Automatically scroll right
        scrollContainer.scrollLeft += scrollSpeed;

        // Check if the user has scrolled to the end, reset scroll to start
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0; // Reset to start
        }
      }
    }, 20); // Adjust interval timing for smoother scrolling
  };

  useEffect(() => {
    // Start auto-scroll on component mount
    startAutoScroll();

    // Clear auto-scroll interval on component unmount
    return () => clearInterval(scrollIntervalRef.current);
  }, []);

  // Handle manual scrolling and restart auto-scroll after the user stops
  const handleScroll = () => {
    clearInterval(scrollIntervalRef.current); // Stop auto-scroll during manual scroll
    setTimeout(() => {
      startAutoScroll(); // Restart auto-scroll after a delay
    }, 1000); // Adjust delay for auto-scroll restart
  };

  // Function to find the matching image for each category
  const getCategoryImage = (categoryName) => {
    const categoryCustomization = homeConfig.sections
      .find((section) => section.type === 'category')
      ?.customization.categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );

    return categoryCustomization ? categoryCustomization.image : 'https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/Baking_needs_300.png?alt=media&token=c1707f2a-92ab-46c5-b219-936b559cb6f2';
  };
  
  const categorySection = homeConfig.sections.find((section) => section.type === 'category');
  const categoryTitle = categorySection ? categorySection.title : 'Categories';
  
  const promotionSections = promotions || [];
  
  return (
    <>
      <div className="mt-20">
        <Suspense fallback={<Loader />}>
          <AdvertisingBanner
            images={adv.images}
            height={adv.dimensions.height}
            width={adv.dimensions.width}
          />
        </Suspense>
      </div>

      {isCategoriesLoading || isProductsLoading ? (
        <Loader />
      ) : categoriesError || productsError ? (
        <Message variant="danger">
          {categoriesError?.data?.message || productsError?.data?.message || categoriesError?.error || productsError?.error}
        </Message>
      ) : (
        <div className="mt-4 mb-24">
          <div className="mt-2 pt-2 relative overflow-hidden">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="overflow-x-scroll scrollbar-hide"
            >
              <div className="flex whitespace-nowrap animate-scroll">
                {promotionSections.map((promotion, index) => (
                  <div
                    key={index}
                    className="inline-block mb-4 mr-3 w-[48%]"
                  >
                    <Suspense fallback={<Loader />}>
                      <PromotionCard
                        title={promotion.title || 'Title'}
                        description={promotion.description || 'Description'}
                        image={promotion.image || ''} 
                      />
                    </Suspense>
                  </div>
                ))}

                {promotionSections.map((promotion, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="inline-block mb-4 mr-3 w-[48%]"
                  >
                    <Suspense fallback={<Loader />}>
                      <PromotionCard
                        title={promotion.title || 'Title'}
                        description={promotion.description || 'Description'}
                        image={promotion.image || ''} 
                      />
                    </Suspense>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h5 className="text-2xl font-serif text-green-800 mb-4 semi-bold">
            {categoryTitle}
          </h5>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 rounded-md p-5">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                name={category}
                image={getCategoryImage(category)} 
                className="p-2 sm:p-1"
              />
            ))}
          </div>

          <h5 className="text-2xl font-serif text-green-800 mb-4 mt-2 semi-bold">
            All Products
          </h5>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1 bg-gray-300 rounded-md p-1">
            {products.map((product) => (
              <Suspense  key={product._id} fallback={<Loader />}>
                <Product product={product} />
              </Suspense>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomeScreen;