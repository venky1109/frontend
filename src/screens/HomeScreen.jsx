import React, { useEffect, useState, useRef, useCallback, Suspense, useMemo } from 'react';
import { useGetProductsByCategoryQuery, useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import homeConfig from '../HomeConfig.json';
import { Link, useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/ProductSkeleton';
import Meta from '../components/Meta';

const CategoryCard = React.lazy(() => import('../components/CategoryCard'));
const Product = React.lazy(() => import('../components/Product'));
const OrderOptions = React.lazy(() => import('../components/OrderOptionsBanner'));

const SITE_URL = 'https://manakirana.com';
const DELIVERY_AREAS = [
  'Amalapuram',
  'Mummidivaram',
  'Yanam',
  'Ambajipeta',
  'Ainavilli',
  'Uppalaguptam',
  'Allavaram',
  'Katrenikona',
  'I. Polavaram',
  'Kothapeta',
];
const DELIVERY_AREA_TEXT = 'Amalapuram • Mummidivaram • Yanam • Nearby Konaseema Areas';
const DELIVERY_HIGHLIGHTS = [
  'Flours & Daily Essentials',
  'Rice & Pulses',
  'Snacks & Breakfast Items',
  'Oils & Spices',
  'Dry Fruits & Nuts',
  'Personal Care Essentials',
  'Cleaning & Home Care',
  'Pooja Items & Daily Needs',
];
const HOME_DESCRIPTION =
  'Order groceries online from Mana Kirana with delivery around Amalapuram, Mummidivaram, Yanam and nearby Konaseema areas. Shop rice, pulses, snacks, oils, spices, dairy, dry fruits, cleaning essentials, pooja needs, personal care and daily home needs.';

const getBudgetDisplayBatch = () => (
  typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 8
);

const CategoryProductSection = ({ category }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const autoScrollFrameRef = useRef(null);
  const lastAutoScrollTimeRef = useRef(0);
  const isHoveringRailRef = useRef(false);
  const resumeInteractionTimeoutRef = useRef(null);
  const dragStateRef = useRef({ isDown: false, startX: 0, lastX: 0, didDrag: false });
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { data, isLoading, error } = useGetProductsByCategoryQuery({ category: category.name, pageSize: 8 });
  const products = data?.products?.slice(0, 8) || [];
  const shouldLoopRail = false;
  const railProducts = products;

  const keepRailInMiddleLoop = useCallback((rail) => {
    if (!rail || !shouldLoopRail) return 0;

    const segmentWidth = rail.scrollWidth / 3;
    if (!segmentWidth) return 0;

    if (rail.scrollLeft < segmentWidth * 0.5) {
      rail.scrollLeft += segmentWidth;
      return segmentWidth;
    }

    if (rail.scrollLeft > segmentWidth * 1.5) {
      rail.scrollLeft -= segmentWidth;
      return -segmentWidth;
    }

    return 0;
  }, [shouldLoopRail]);

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
    if (!rail || !shouldLoopRail) return;

    const frameId = window.requestAnimationFrame(() => {
      const segmentWidth = rail.scrollWidth / 3;
      if (segmentWidth && rail.scrollLeft < segmentWidth * 0.5) {
        rail.scrollLeft = segmentWidth;
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [products.length, shouldLoopRail]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !isSectionVisible || isUserInteracting || !shouldLoopRail) return;

    const autoScroll = (time) => {
      if (!lastAutoScrollTimeRef.current) {
        lastAutoScrollTimeRef.current = time;
      }

      const elapsed = Math.min(time - lastAutoScrollTimeRef.current, 32);
      lastAutoScrollTimeRef.current = time;
      const loopPoint = rail.scrollWidth / 2;
      if (!loopPoint) return;

      rail.scrollLeft += elapsed * 0.018;
      keepRailInMiddleLoop(rail);

      autoScrollFrameRef.current = window.requestAnimationFrame(autoScroll);
    };

    rail.style.scrollBehavior = 'auto';
    autoScrollFrameRef.current = window.requestAnimationFrame(autoScroll);

    return () => {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      lastAutoScrollTimeRef.current = 0;
      if (rail) {
        rail.style.scrollBehavior = '';
      }
    };
  }, [isSectionVisible, isUserInteracting, shouldLoopRail, keepRailInMiddleLoop]);

  const pauseRailInteraction = useCallback(() => {
    window.clearTimeout(resumeInteractionTimeoutRef.current);
    setIsUserInteracting(true);
  }, []);

  const resumeRailInteraction = useCallback((delay = 0) => {
    window.clearTimeout(resumeInteractionTimeoutRef.current);
    resumeInteractionTimeoutRef.current = window.setTimeout(() => {
      if (!isHoveringRailRef.current && !dragStateRef.current.isDown) {
        setIsUserInteracting(false);
      }
    }, delay);
  }, []);

  const handleRailPointerDown = useCallback((event) => {
    const rail = railRef.current;
    if (!rail) return;
    if (event.target.closest('button, input, select, textarea')) {
      dragStateRef.current = { isDown: false, startX: 0, lastX: 0, didDrag: false };
      return;
    }

    keepRailInMiddleLoop(rail);
    dragStateRef.current = {
      isDown: true,
      startX: event.clientX,
      lastX: event.clientX,
      didDrag: false,
    };
    pauseRailInteraction();
    rail.style.scrollBehavior = 'auto';
    rail.classList.add('cursor-grabbing');
    rail.setPointerCapture?.(event.pointerId);
  }, [keepRailInMiddleLoop, pauseRailInteraction]);

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
    resumeRailInteraction(1200);
  }, [resumeRailInteraction]);

  const handleRailPointerMove = useCallback((event) => {
    const rail = railRef.current;
    const dragState = dragStateRef.current;
    if (!rail || !dragState.isDown) return;

    event.preventDefault();
    const totalWalk = event.clientX - dragState.startX;
    const movement = event.clientX - dragState.lastX;

    if (Math.abs(totalWalk) > 4) {
      dragState.didDrag = true;
    }

    rail.scrollLeft -= movement;
    dragState.lastX = event.clientX;
    keepRailInMiddleLoop(rail);
  }, [keepRailInMiddleLoop]);

  const handleRailClickCapture = useCallback((event) => {
    if (dragStateRef.current.didDrag) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.didDrag = false;
    }
  }, []);

  const handleProductOpen = useCallback((product, state) => {
    if (dragStateRef.current.didDrag) return;
    navigate(`/product/${product.slug}`, { state });
  }, [navigate]);

  const handleRailWheel = useCallback((event) => {
    const rail = railRef.current;
    if (!rail || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    pauseRailInteraction();
    rail.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
    resumeRailInteraction(900);
  }, [pauseRailInteraction, resumeRailInteraction]);

  const handleRailMouseEnter = useCallback(() => {
    isHoveringRailRef.current = true;
    pauseRailInteraction();
  }, [pauseRailInteraction]);

  const handleRailMouseLeave = useCallback((event) => {
    isHoveringRailRef.current = false;
    stopRailDrag(event);
  }, [stopRailDrag]);

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
      </div>

      <Suspense fallback={<Loader />}>
        <div
          ref={railRef}
          className="flex cursor-grab gap-1 overflow-x-auto scroll-smooth rounded-lg bg-gray-100 p-1 pb-2 scrollbar-hide select-none"
          style={{ touchAction: 'pan-y' }}
          onMouseEnter={handleRailMouseEnter}
          onMouseLeave={handleRailMouseLeave}
          onPointerDown={handleRailPointerDown}
          onPointerUp={stopRailDrag}
          onPointerCancel={stopRailDrag}
          onPointerMove={handleRailPointerMove}
          onClickCapture={handleRailClickCapture}
          onDragStart={(event) => event.preventDefault()}
          onWheel={handleRailWheel}
          onTouchStart={pauseRailInteraction}
          onTouchEnd={() => resumeRailInteraction(900)}
          onFocus={pauseRailInteraction}
          onBlur={() => resumeRailInteraction(900)}
        >
          {railProducts.map((product, index) => (
            <div key={`${product._id}-${index}`} className="flex min-w-0 shrink-0 grow-0 basis-[calc((100%_-_0.5rem)/3)] md:basis-[calc((100%_-_1.25rem)/6)] lg:basis-[calc((100%_-_1.75rem)/8)]">
              <Product product={product} compactRibbon desktopCompact onProductOpen={handleProductOpen} />
            </div>
          ))}
          <div className="flex min-w-0 shrink-0 grow-0 basis-[calc((100%_-_0.5rem)/3)] md:basis-[calc((100%_-_1.25rem)/6)] lg:basis-[calc((100%_-_1.75rem)/8)]">
            <button
              type="button"
              onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
              className="flex min-h-[11rem] w-full flex-col items-center justify-center rounded-lg border border-dashed border-green-600 bg-white px-2 py-3 text-center text-xs font-semibold text-green-700 shadow-sm transition hover:bg-green-50 md:min-h-[14.25rem]"
              aria-label={`View more ${category.name} products`}
            >
              <span className="text-lg leading-none">+</span>
              <span className="mt-1">More</span>
              <span className="mt-0.5 max-w-full truncate text-[10px] text-gray-500">{category.name}</span>
            </button>
          </div>
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
  const [displayCount, setDisplayCount] = useState(getBudgetDisplayBatch);
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
  const featuredProductCategories = useMemo(() => {
    const preferredCategoryNames = [
      'BATH & BODY',
      'RICE & PULSES',
      'CLEANING ESSENTIALS',
      'DAILY NEEDS',
      'FLOURS',
    ];

    return preferredCategoryNames
      .map((categoryName) => productCategories.find((category) => category.name === categoryName))
      .filter(Boolean);
  }, [productCategories]);
  const categoryNames = useMemo(() => categories.map((category) => category.name), [categories]);
  const seoKeywords = useMemo(
    () => [
      'online grocery delivery',
      'Mana Kirana',
      'grocery home delivery',
      'kirana store online',
      'grocery delivery Amalapuram',
      'grocery delivery Mummidivaram',
      'grocery delivery Yanam',
      'online groceries Konaseema',
      ...DELIVERY_AREAS,
      ...categoryNames,
    ].join(', '),
    [categoryNames]
  );
  const homeJsonLd = useMemo(() => ([
    {
      '@context': 'https://schema.org',
      '@type': 'GroceryStore',
      name: 'Mana Kirana',
      url: SITE_URL,
      image: `${SITE_URL}/images/logoSquare512_v1.webp`,
      description: HOME_DESCRIPTION,
      telephone: homeConfig.phoneNumber?.[0],
      areaServed: DELIVERY_AREAS.map((area) => ({
        '@type': 'City',
        name: area,
      })),
      sameAs: [SITE_URL],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Mana Kirana',
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search/{search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Mana Kirana grocery categories',
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.name,
        url: `${SITE_URL}/category/${encodeURIComponent(category.name)}`,
      })),
    },
  ]), [categories]);

  const categoryName = 'BUDGET FRIENDLY PACKAGES';
  const shouldFetch = initialCachedProducts.length === 0;

  const { data: productsData, isLoading: isProductsLoading, error: productsError } =
    useGetProductsByCategoryQuery(categoryName, {
      skip: !shouldFetch,
    });
  const { data: seoProductsData } = useGetProductsQuery({ pageSize: 80 });

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
      setDisplayCount(prev => prev + getBudgetDisplayBatch());
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
    navigate(`/category/${encodeURIComponent(name)}`);
  }, [navigate]);

  const renderedProducts = useMemo(() => {
    return isProductsLoading
      ? Array.from({ length: displayCount }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))
      : products
          .slice(0, displayCount)
          .map(product => <Product key={product._id} product={product} alwaysShowOptions desktopCompact />);
  }, [isProductsLoading, products, displayCount]);
  const seoProductsByCategory = useMemo(() => {
    const groupedProducts = {};

    (seoProductsData?.products || []).forEach((product) => {
      if (!product?.category || !product?.slug) return;

      if (!groupedProducts[product.category]) {
        groupedProducts[product.category] = [];
      }

      if (groupedProducts[product.category].length < 5) {
        groupedProducts[product.category].push(product);
      }
    });

    return Object.entries(groupedProducts).slice(0, 8);
  }, [seoProductsData]);

  return (
    <div className="mt-16 mb-24 sm:mt-20">
      <Meta
        title="Mana Kirana Online Grocery Delivery | Daily Essentials, Snacks, Rice, Oils"
        description={HOME_DESCRIPTION}
        keywords={seoKeywords}
        canonical={SITE_URL}
        url={SITE_URL}
        image={`${SITE_URL}/images/logoSquare512_v1.webp`}
        jsonLd={homeJsonLd}
      />
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
          <section className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
            <div className="bg-green-700 px-4 py-2.5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-100">Local grocery delivery</p>
              <h1 className="mt-1 text-2xl font-bold leading-tight">
                Order Groceries Online from Mana Kirana
              </h1>
              <p className="mt-2 text-sm font-medium text-green-50">
                Delivery Available In: {DELIVERY_AREA_TEXT}
              </p>
            </div>

            <div className="px-4 py-2.5">
              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium text-gray-800 sm:grid-cols-3 sm:text-sm">
                {DELIVERY_HIGHLIGHTS.map((item) => (
                  <div key={item} className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1.5">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-2 rounded-md bg-amber-50 px-3 py-1.5 text-center text-sm font-semibold text-amber-900">
                Fast Delivery • Easy Ordering • Trusted Local Store
              </p>
            </div>
          </section>

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
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 md:grid-cols-6 xl:grid-cols-8">
                {renderedProducts}
              </div>
            </Suspense>
          </section>

          {featuredProductCategories.map((category) => (
            <CategoryProductSection key={category.key} category={category} />
          ))}

          <section className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Quick grocery links</p>
              <h2 className="text-xl font-bold text-gray-900">Shop all Mana Kirana products by category</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Find online grocery delivery for daily essentials, rice and pulses, oils, snacks, spices,
                dairy, cleaning products, pooja needs, health and personal care.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <Link
                to="/category/all"
                className="rounded-md border border-green-700 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={`seo-${category.key}`}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-green-700 hover:text-green-700"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {seoProductsByCategory.length > 0 && (
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {seoProductsByCategory.map(([category, categoryProducts]) => (
                  <div key={`product-links-${category}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <Link
                      to={`/category/${encodeURIComponent(category)}`}
                      className="font-semibold text-gray-900 hover:text-green-700"
                    >
                      {category}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categoryProducts.map((product) => (
                        <Link
                          key={`seo-product-${product._id}`}
                          to={`/product/${product.slug}`}
                          className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:border-green-700 hover:text-green-700"
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div ref={observerRef} className="h-10 w-full"></div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
