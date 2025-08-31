import React, { useEffect, useState, useRef, useCallback, Suspense, useMemo } from 'react';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import homeConfig from '../HomeConfig.json';
import { useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/ProductSkeleton';

const CategoryCard = React.lazy(() => import('../components/CategoryCard'));
const Product = React.lazy(() => import('../components/Product'));
const OrderOptions = React.lazy(() => import('../components/OrderOptionsBanner'));

const HomeScreen = () => {
  const initialCachedProducts = useMemo(() => {
    const cached = localStorage.getItem('cachedProducts');
    return cached ? JSON.parse(cached) : [];
  }, []);

  const [products, setProducts] = useState(initialCachedProducts);
  const [displayCount, setDisplayCount] = useState(6);
  const observerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const navigate = useNavigate();
  const scrollSpeed = 0;

  // Load categories from config
  const categorySection = useMemo(() => homeConfig.sections.find(section => section.type === 'category'), []);
  const categoryTitle = categorySection?.title || 'Categories';
  const categories = useMemo(() => categorySection?.customization?.categories || [], [categorySection]);

  const categoryName = 'BUDGET FRIENDLY PACKAGES';
  const shouldFetch = initialCachedProducts.length === 0;

  const { data: productsData, isLoading: isProductsLoading, error: productsError } =
    useGetProductsByCategoryQuery(categoryName, {
      skip: !shouldFetch,
    });

  useEffect(() => {
    const cachedProducts = localStorage.getItem('cachedProducts');
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    }

    if (productsData?.products) {
      setProducts(productsData.products);
      localStorage.setItem('cachedProducts', JSON.stringify(productsData.products));
    }
  }, [productsData]);

  const loadMoreProducts = useCallback(() => {
    if (products.length > displayCount) {
      setDisplayCount(prev => prev + 6);
    }
  }, [products, displayCount]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
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

  const renderedProducts = useMemo(() => {
    return isProductsLoading
      ? Array.from({ length: displayCount }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))
      : products
          .slice(0, displayCount)
          .map(product => <Product key={product._id} product={product} />);
  }, [isProductsLoading, products, displayCount]);

  return (
    <>
      <div className="mt-28">
        <Suspense fallback={<Loader />}><OrderOptions /></Suspense>
      </div>

      {isProductsLoading ? (
        <Loader />
      ) : productsError ? (
        <Message variant="danger">
          {productsError?.data?.message || productsError?.error}
        </Message>
      ) : (
        <div className="mt-4 mb-24">
          <h5 className="text-xl font-serif text-green-800 mt-8 semi-bold">{categoryTitle.toUpperCase()}</h5>

          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-x-0 pt-3 pb-3 pl-2 pr-2">
              {categories.map(cat => (
                <CategoryCard
                  key={cat.key}
                  name={cat.name}
                  image={cat.image}
                  onClick={() => handleCategoryCardClick(cat.name)}
                  className="p-0 sm:p-0 lg:p-1"
                />
              ))}
            </div>
          </Suspense>

          <h5 className="text-xl font-serif text-green-800 mb-4 mt-8 semi-bold">MK BUDGET PACKAGES</h5>

          <Suspense fallback={<Loader />}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-1 bg-gray-200 rounded-md p-1">
              {renderedProducts}
            </div>
          </Suspense>

          <div ref={observerRef} className="h-10 w-full"></div>
        </div>
      )}
    </>
  );
};

export default HomeScreen;
