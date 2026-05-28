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

const CategoryProductSection = ({ category }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const dragStateRef = useRef({ isDown: false, startX: 0, scrollLeft: 0, didDrag: false });
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { data, isLoading, error } = useGetProductsByCategoryQuery(category.name);
  const products = data?.products?.slice(0, 10) || [];
  const railProducts = products.length > 3 ? [...products, ...products] : products;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSectionVisible(entry.isIntersecting),
      { threshold: 0.65 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !isSectionVisible || isUserInteracting || products.length <= 3) return;

    const interval = setInterval(() => {
      const firstCard = rail.firstElementChild;
      if (!firstCard) return;

      const cardStep = firstCard.getBoundingClientRect().width + 4;
      const nextLeft = rail.scrollLeft + cardStep;
      const loopPoint = rail.scrollWidth / 2;

      rail.scrollTo({
        left: nextLeft,
        behavior: 'smooth',
      });

      if (nextLeft >= loopPoint) {
        window.setTimeout(() => {
          rail.scrollLeft = nextLeft - loopPoint;
        }, 450);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isSectionVisible, isUserInteracting, products.length]);

  const handleRailPointerDown = useCallback((event) => {
    const rail = railRef.current;
    if (!rail) return;

    dragStateRef.current = {
      isDown: true,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      didDrag: false,
    };
    setIsUserInteracting(true);
    rail.style.scrollBehavior = 'auto';
    rail.classList.add('cursor-grabbing');
    rail.setPointerCapture?.(event.pointerId);
  }, []);

  const stopRailDrag = useCallback((event) => {
    const rail = railRef.current;
    dragStateRef.current.isDown = false;
    rail?.classList.remove('cursor-grabbing');
    if (rail) {
      rail.style.scrollBehavior = '';
      if (event?.pointerId && rail.hasPointerCapture?.(event.pointerId)) {
        rail.releasePointerCapture(event.pointerId);
      }
    }
    setIsUserInteracting(false);
  }, []);

  const handleRailPointerMove = useCallback((event) => {
    const rail = railRef.current;
    const dragState = dragStateRef.current;
    if (!rail || !dragState.isDown) return;

    event.preventDefault();
    const walk = (event.clientX - dragState.startX) * 1.25;

    if (Math.abs(walk) > 4) {
      dragState.didDrag = true;
    }

    rail.scrollLeft = dragState.scrollLeft - walk;
  }, []);

  const handleRailClickCapture = useCallback((event) => {
    if (dragStateRef.current.didDrag) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.didDrag = false;
    }
  }, []);

  const handleRailWheel = useCallback((event) => {
    const rail = railRef.current;
    if (!rail || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    setIsUserInteracting(true);
    rail.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
    window.setTimeout(() => setIsUserInteracting(false), 600);
  }, []);

  if (isLoading) {
    return (
      <section ref={sectionRef} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="mb-3 h-6 w-40 rounded bg-gray-100" />
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Top picks</p>
          <h2 className="truncate text-lg font-bold text-gray-900">{category.name}</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
          className="flex-none rounded-md border border-green-700 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50"
        >
          View More
        </button>
      </div>

      <Suspense fallback={<Loader />}>
        <div
          ref={railRef}
          className="flex cursor-grab snap-x snap-mandatory gap-1 overflow-x-auto scroll-smooth rounded-lg bg-gray-100 p-1 pb-2 scrollbar-hide select-none"
          style={{ touchAction: 'pan-y' }}
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={stopRailDrag}
          onPointerDown={handleRailPointerDown}
          onPointerUp={stopRailDrag}
          onPointerCancel={stopRailDrag}
          onPointerMove={handleRailPointerMove}
          onClickCapture={handleRailClickCapture}
          onWheel={handleRailWheel}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => setIsUserInteracting(false)}
          onFocus={() => setIsUserInteracting(true)}
          onBlur={() => setIsUserInteracting(false)}
        >
          {railProducts.map((product, index) => (
            <div key={`${product._id}-${index}`} className="flex min-w-0 shrink-0 grow-0 basis-[calc((100%_-_0.5rem)/3)] snap-start md:basis-[calc((100%_-_0.75rem)/4)] lg:basis-[calc((100%_-_1rem)/5)]">
              <Product product={product} compactRibbon />
            </div>
          ))}
        </div>
      </Suspense>
    </section>
  );
};

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
  const productCategories = useMemo(
    () => categories.filter((cat) => cat.name !== 'BUDGET FRIENDLY PACKAGES'),
    [categories]
  );

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
          .map(product => <Product key={product._id} product={product} alwaysShowOptions />);
  }, [isProductsLoading, products, displayCount]);

  return (
    <div className="mt-16 mb-24 sm:mt-20">
      <div className="rounded-b-2xl bg-gradient-to-b from-green-50 via-white to-white pb-3 pt-1">
        <Suspense fallback={<Loader />}>
          <OrderOptions />
        </Suspense>
      </div>

      {isProductsLoading ? (
        <Loader />
      ) : productsError ? (
        <Message variant="danger">
          {productsError?.data?.message || productsError?.error}
        </Message>
      ) : (
        <div className="space-y-6">
          <section id="categories" className="scroll-mt-20 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Shop by aisle</p>
                <h2 className="text-xl font-bold text-gray-900">{categoryTitle}</h2>
              </div>
            </div>

            <Suspense fallback={<Loader />}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8">
                {categories.map(cat => (
                  <CategoryCard
                    key={cat.key}
                    name={cat.name}
                    image={cat.image}
                    onClick={() => handleCategoryCardClick(cat.name)}
                  />
                ))}
              </div>
            </Suspense>
          </section>

          <section className="rounded-xl border border-green-100 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Best value picks</p>
                <h2 className="text-xl font-bold text-gray-900">MK Budget Packages</h2>
              </div>
              <button
                type="button"
                onClick={() => handleCategoryCardClick('BUDGET FRIENDLY PACKAGES')}
                className="flex-none rounded-md border border-green-700 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50"
              >
                View More
              </button>
            </div>

            <Suspense fallback={<Loader />}>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
                {renderedProducts}
              </div>
            </Suspense>
          </section>

          {productCategories.map((category) => (
            <CategoryProductSection key={category.key} category={category} />
          ))}

          <div ref={observerRef} className="h-10 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
