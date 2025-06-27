import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import homeConfig from '../HomeConfig.json';
import { useNavigate } from 'react-router-dom';
// import MegaBanner from '../components/MegaBanner';
// import OrderOptions from '../components/OrderOptionsBanner';


// Lazily load components
const CategoryCard = React.lazy(() => import('../components/CategoryCard'));
const Product = React.lazy(() => import('../components/Product'));
// const MiniProductCard=React.lazy(() => import('../components/MiniProductCard'))
const AdvertiseSlider = React.lazy(() => import('../components/AdvertiseSlider'));
const MegaBanner = React.lazy(() => import('../components/MegaBanner'));
// const ChildBanner = React.lazy(() => import('../components/ChildBanner'));
// const FreeHomeDelivery = React.lazy(() => import('../components/SubChild'));
const OrderOptions = React.lazy(() => import('../components/OrderOptionsBanner'));

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  const observerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const navigate = useNavigate();
  const scrollSpeed = 0;

  const { data: categoriesData, isLoading: isCategoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
  const categoryName = 'BUDGET FRIENDLY PACKAGES';
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = useGetProductsByCategoryQuery(categoryName);

  useEffect(() => {
    if (categoriesData?.categories) setCategories(categoriesData.categories);
    if (productsData?.products) setProducts(productsData.products);
  }, [categoriesData, productsData]);

  const loadMoreProducts = useCallback(() => {
    if (products.length > displayCount) {
      setDisplayCount((prev) => prev + 6);
    }
  }, [products, displayCount]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreProducts();
      },
      { threshold: 1.0 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMoreProducts]);

  const startAutoScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    scrollIntervalRef.current = setInterval(() => {
      if (container) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollLeft = 0;
        }
      }
    }, 20);
  }, [scrollSpeed]);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(scrollIntervalRef.current);
  }, [startAutoScroll]);

  const handleCategoryCardClick = useCallback((name) => {
    navigate(`/category/${name}`);
  }, [navigate]);

  const getCategoryImage = useCallback((name) => {
    return homeConfig.sections
      .find((s) => s.type === 'category')
      ?.customization.categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())?.image
      ?? 'https://firebasestorage.googleapis.com/v0/b/manakirana-988b3.appspot.com/o/Baking_needs_300.png?alt=media&token=c1707f2a-92ab-46c5-b219-936b559cb6f2';
  }, []);

  const categorySection = homeConfig.sections.find((section) => section.type === 'category');
  const categoryTitle = categorySection?.title || 'Categories';

  return (
    <>
      <div className="container mx-auto mt-28">
        <Suspense fallback={<Loader />}><MegaBanner /></Suspense>
      </div>

      {/* <div className="mt-3"><Suspense fallback={<Loader />}><ChildBanner /></Suspense></div> */}
      {/* <div className="mt-3 mb-3"><Suspense fallback={<Loader />}><FreeHomeDelivery /></Suspense></div> */}
      <div className="mt-3"><Suspense fallback={<Loader />}><OrderOptions /></Suspense></div>

      <div className="container mx-auto">
        <Suspense fallback={<Loader />}><AdvertiseSlider /></Suspense>
      </div>

      {isCategoriesLoading || isProductsLoading ? (
        <Loader />
      ) : categoriesError || productsError ? (
        <Message variant="danger">
          {categoriesError?.data?.message || productsError?.data?.message || categoriesError?.error || productsError?.error}
        </Message>
      ) : (
        <div className="mt-4 mb-24">
          <h5 className="text-xl font-serif text-green-800 mt-8 semi-bold">{categoryTitle.toUpperCase()}</h5>
          
          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-x-0 pt-3 pb-3 pl-2 pr-2">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat}
                  name={cat}
                  image={getCategoryImage(cat)}
                  onClick={() => handleCategoryCardClick(cat)}
                  className="p-0 sm:p-0 lg:p-1"
                />
              ))}
            </div>
          </Suspense>

          <h5 className="text-xl font-serif text-green-800 mb-4 mt-8 semi-bold">MK BUDGET PACKAGES</h5>

          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1 bg-gray-200 rounded-md p-1">
              {products.slice(0, displayCount).map((product) => (
                <Product key={product._id} product={product} />
                // <MiniProductCard key={product._id} product={product} />

              ))}
            </div>
          </Suspense>

          <div ref={observerRef} className="h-10 w-full"></div>
        </div>
      )}
    </>
  );
};

export default HomeScreen;
