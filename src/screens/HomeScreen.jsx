import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
// import { useFetchPromotionsQuery } from '../slices/promotionsAPISlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import advertise from '../advertise';
import homeConfig from '../HomeConfig.json';
import { useNavigate } from 'react-router-dom';
import AdvertisingBanner from '../components/Advertise';
import Product from '../components/Product';

// Lazy load components to reduce initial bundle size
const CategoryCard = React.lazy(() => import('../components/CategoryCard'));
// const PromotionCard = React.lazy(() => import('../components/PromotionCard'));

const HomeScreen = () => {
  const adv = advertise.find((item) => item.type === 'BodyBanner');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const scrollSpeed = 0; // Adjust scroll speed
  const navigate = useNavigate();
  const scrollIntervalRef = useRef(null);

  // Fetch all categories
  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
  
  // Fetch all products
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useGetProductsQuery({ keyword: '', pageNumber: 1 });

  // Fetch promotions using the generated hook
  // const { data: promotions } = useFetchPromotionsQuery();

  useEffect(() => {
    if (categoriesData && categoriesData.categories) {
      setCategories(categoriesData.categories);
    }
    if (productsData && productsData.products) {
      // const dailyNeedsProducts = productsData.products.filter(product => product.category === 'MANA KIRANA CUSTOMISED PACKAGES');
      // setProducts(dailyNeedsProducts);
      setProducts(productsData.products);
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
      <div className="mt-20">
        <AdvertisingBanner
          images={adv.images}
          height={adv.dimensions.height}
          width={adv.dimensions.width}
        />
      </div>

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
          <h5 className="text-2xl font-serif text-green-800 mb-4 semi-bold">
            {categoryTitle.toUpperCase()}
          </h5>

          <React.Suspense fallback={<Loader />}>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 rounded-md p-5">
              {categories.map((category) => (
                <CategoryCard
                  key={category}
                  name={category}
                  image={getCategoryImage(category)}
                  onClick={() => handleCategoryCardClick(category)}
                  className="p-2 sm:p-1"
                />
              ))}
            </div>
          </React.Suspense>

          <h5 className="text-2xl font-serif text-green-800 mb-4 mt-2 semi-bold">
          MANA KIRANA PRODUCTS
          </h5>

          <React.Suspense fallback={<Loader />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1 bg-gray-300 rounded-md p-1">
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
