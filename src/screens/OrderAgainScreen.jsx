import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCartPlus, FaCheck } from 'react-icons/fa';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import homeConfig from '../HomeConfig.json';

const categoryConfig =
  homeConfig.sections.find((section) => section.type === 'category')?.customization?.categories || [];

const getProductId = (item) => String(item.productId || item.product || '');

const getFirstImage = (product, brandId) => {
  const detail =
    product?.details?.find((entry) => String(entry._id) === String(brandId)) ||
    product?.details?.[0];

  return detail?.images?.[0]?.image || '';
};

const findFinancial = (product, brandId, financialId) => {
  const detail =
    product?.details?.find((entry) => String(entry._id) === String(brandId)) ||
    product?.details?.[0];
  const financial =
    detail?.financials?.find((entry) => String(entry._id) === String(financialId)) ||
    detail?.financials?.[0];

  return { detail, financial };
};

const formatPack = (quantity, units) => [quantity, units].filter(Boolean).join(' ');

const getOrderItemIdentity = ({ item, order, detail, financial, productId }) =>
  [
    productId,
    detail?._id || item.brandId || item.brand || 'brand',
    financial?._id || item.financialId || item.quantity || 'pack',
    item._id || order._id || order.createdAt || 'order',
  ]
    .map((value) => String(value || ''))
    .join('-');

const getProductPackKey = ({ item, detail, financial, productId }) =>
  [
    productId,
    detail?._id || item.brandId || item.brand || 'brand',
    financial?._id || item.financialId || `${item.quantity || ''}${item.units || ''}` || 'pack',
  ]
    .map((value) => String(value || '').trim().toLowerCase())
    .join('-');

const OrderAgainScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetMyOrdersQuery();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({ pageSize: 500 });

  const products = useMemo(() => productsData?.products || [], [productsData]);

  const productById = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      map.set(String(product._id), product);
    });
    return map;
  }, [products]);

  const orderAgainData = useMemo(() => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    const itemMap = new Map();

    sortedOrders.forEach((order) => {
      (order.orderItems || []).forEach((item) => {
        const productId = getProductId(item);
        if (!productId) return;

        const currentProduct = productById.get(productId);
        if (!currentProduct) return;

        const category = currentProduct?.category || item.category || 'Previous Orders';
        const { detail, financial } = findFinancial(currentProduct, item.brandId, item.financialId);
        const key = getProductPackKey({ item, detail, financial, productId });
        const reorderKey = getOrderItemIdentity({ item, order, detail, financial, productId });

        if (!itemMap.has(key)) {
          itemMap.set(key, {
            ...item,
            productId,
            category,
            slug: currentProduct?.slug || item.slug,
            name: currentProduct?.name || item.name,
            brand: detail?.brand || item.brand,
            brandId: detail?._id || item.brandId,
            financialId: financial?._id || item.financialId,
            quantity: financial?.quantity ?? item.quantity,
            units: financial?.units || item.units,
            price: financial?.dprice ?? item.price,
            dprice: financial?.dprice ?? item.dprice ?? item.price,
            Discount: financial?.Discount ?? item.Discount ?? 0,
            image: getFirstImage(currentProduct, item.brandId) || item.image,
            orderedQty: item.qty || 1,
            lastOrderedAt: order.createdAt,
            totalOrderedQty: item.qty || 1,
            reorderKey,
          });
        } else {
          const savedItem = itemMap.get(key);
          savedItem.totalOrderedQty += item.qty || 1;
        }
      });
    });

    const items = Array.from(itemMap.values());
    const categoryMap = new Map();

    items.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        const configured = categoryConfig.find((category) => category.name === item.category);
        categoryMap.set(item.category, {
          name: item.category,
          image: configured?.image || item.image || '/images/icon-192.png',
          count: 0,
        });
      }
      categoryMap.get(item.category).count += 1;
    });

    return {
      categories: Array.from(categoryMap.values()),
      items,
    };
  }, [orders, productById]);

  useEffect(() => {
    if (!selectedCategory && orderAgainData.categories.length > 0) {
      setSelectedCategory(orderAgainData.categories[0].name);
    }
  }, [orderAgainData.categories, selectedCategory]);

  const selectedItems = useMemo(
    () => orderAgainData.items.filter((item) => item.category === selectedCategory),
    [orderAgainData.items, selectedCategory]
  );

  const cartItemKeys = useMemo(() => {
    const keys = new Set();
    cartItems.forEach((item) => {
      keys.add(`${item.productId}-${item.brandId || item.brand}-${item.financialId || item.quantity}`);
    });
    return keys;
  }, [cartItems]);

  const isItemInCart = (item) =>
    cartItemKeys.has(`${item.productId}-${item.brandId || item.brand}-${item.financialId || item.quantity}`);

  const addPreviousItemToCart = (item) => {
    dispatch(
      addToCart({
        name: item.name,
        productId: item.productId,
        slug: item.slug,
        category: item.category,
        brand: item.brand,
        quantity: item.quantity,
        units: item.units,
        price: item.price,
        dprice: item.dprice,
        Discount: item.Discount,
        image: item.image,
        qty: item.orderedQty || 1,
        financialId: item.financialId,
        brandId: item.brandId,
        countInStock: 10,
      })
    );
  };

  const isLoading = ordersLoading || productsLoading;
  const error = ordersError || productsError;

  if (isLoading) return <Loader />;

  if (error) {
    return <Message variant="danger">{error?.data?.message || error.error}</Message>;
  }

  return (
    <div className="mb-24 mt-20 min-h-[calc(100vh-9rem)] bg-white md:bg-slate-50/70 md:px-4 md:py-5">
      <div className="mx-auto max-w-7xl">
      <div className="mb-3 flex items-center justify-between gap-2 md:mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm md:rounded-full md:px-4 md:text-sm"
        >
          <FaArrowLeft className="h-3 w-3" />
          Back
        </button>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            Order Again
          </p>
          <h1 className="text-base font-extrabold text-slate-950">Previous Order Items</h1>
        </div>
      </div>

      {orderAgainData.items.length === 0 ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
          No available previous order items found yet.
        </div>
      ) : (
        <div className="grid min-h-[calc(100vh-11rem)] grid-cols-[4.25rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm md:min-h-[calc(100vh-13rem)] md:grid-cols-[16rem_minmax(0,1fr)] md:rounded-2xl md:border-slate-200 md:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <aside className="overflow-y-auto border-r border-slate-100 bg-slate-50 pb-3 md:bg-white md:p-3">
            <div className="hidden px-2 pb-3 md:block">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Categories
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                From previous orders
              </p>
            </div>
            {orderAgainData.categories.map((category) => {
              const active = category.name === selectedCategory;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex w-full flex-col items-center gap-1 border-b border-slate-100 px-1 py-2 text-center transition md:mb-2 md:flex-row md:gap-3 md:rounded-xl md:border md:px-2.5 md:py-2.5 md:text-left ${
                    active ? 'bg-white text-emerald-800 md:border-emerald-200 md:bg-emerald-50' : 'text-slate-600 md:border-slate-100 md:bg-white md:hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-md border bg-white md:h-14 md:w-14 ${
                      active ? 'border-emerald-200 shadow-sm' : 'border-slate-100'
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="min-w-0 md:flex-1">
                    <span className="line-clamp-2 text-[9px] font-bold leading-tight md:text-xs md:leading-snug">
                      {category.name}
                    </span>
                    <span className="mt-0.5 hidden text-[11px] font-bold text-slate-400 md:block">
                      {category.count} {category.count === 1 ? 'item' : 'items'}
                    </span>
                  </span>
                </button>
              );
            })}
          </aside>

          <section className="min-w-0 overflow-y-auto bg-white pb-5 md:bg-slate-50/70 md:pb-6">
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-3 py-2 backdrop-blur md:px-5 md:py-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Previous Order Items
              </p>
              <h1 className="truncate text-base font-extrabold text-slate-950">
                {selectedCategory}
              </h1>
            </div>

            <div className="divide-y divide-slate-100 md:grid md:grid-cols-3 md:gap-3 md:divide-y-0 md:p-4 xl:grid-cols-4">
              {selectedItems.map((item) => (
                (() => {
                  const inCart = isItemInCart(item);

                  return (
                <div
                  key={item.reorderKey}
                  className="grid grid-cols-[6.4rem_minmax(0,1fr)] gap-3 px-3 py-3 md:flex md:min-h-[18rem] md:flex-col md:rounded-xl md:border md:border-slate-100 md:bg-white md:p-2.5 md:shadow-[0_5px_14px_rgba(15,23,42,0.05)]"
                >
                  <Link
                    to={item.slug ? `/product/${item.slug}` : `/category/${encodeURIComponent(item.category)}`}
                    className="relative aspect-[4/5] overflow-hidden rounded-md bg-emerald-50 md:aspect-[5/4] md:w-full md:rounded-lg"
                  >
                    {item.Discount > 0 && (
                      <span className="absolute left-1 top-1 z-10 rounded bg-emerald-700 px-1 py-0.5 text-[8px] font-bold uppercase leading-none text-white md:left-2 md:top-2 md:px-2 md:py-1 md:text-[10px]">
                        {Number(item.Discount).toFixed(0)}% Off
                      </span>
                    )}
                    <img
                      src={item.image || '/images/icon-192.png'}
                      alt={item.name}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col md:flex-1 md:pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold leading-snug text-slate-950 md:text-base">
                          &#x20b9;{Math.round(Number(item.dprice || item.price || 0))}
                        </p>
                        <h2 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-slate-950 md:text-sm">
                          {item.brand}
                        </h2>
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-700 md:mt-1 md:text-sm">
                          {item.name} - {formatPack(item.quantity, item.units)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addPreviousItemToCart(item)}
                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg border shadow-sm md:h-9 md:w-9 ${
                          inCart
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50'
                        }`}
                        aria-label={inCart ? `${item.name} is in cart` : `Add ${item.name} to cart`}
                      >
                        {inCart ? <FaCheck className="h-4 w-4" /> : <FaCartPlus className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 text-[10px] font-bold md:gap-2 md:pt-4">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                        Ordered {item.totalOrderedQty}
                      </span>
                      {item.lastOrderedAt && (
                        <span className="rounded-full bg-slate-50 px-2 py-0.5 text-slate-500">
                          {new Date(item.lastOrderedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                  );
                })()
              ))}
            </div>
          </section>
        </div>
      )}
      </div>
    </div>
  );
};

export default OrderAgainScreen;
