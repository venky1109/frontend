import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery, useGetProductsByCategoryQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { FiChevronDown } from 'react-icons/fi';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Meta from '../components/Meta';

const SITE_URL = 'https://manakirana.com';

const ProductScreen = () => {
  const { slug } = useParams();  // ✅ Extract slug from URL
  // console.log("Extracted Slug:", slug);  // ✅ Debugging log
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const { brand, quantity, qty } = location.state || {};

  // const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const { data: product, isLoading, error } = useGetProductDetailsQuery(slug);
  const { data: categoryData } = useGetProductsByCategoryQuery(product?.category, {
    skip: !product?.category,
  });
  // console.log("Product Object:", product); 


  const [selectedBrand, setSelectedBrand] = useState(brand || '');
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || '1');
  const [selectedQty, setSelectedQty] = useState(qty || '1');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false); // State for tracking "Added to Cart"

  const [cartState, setCartState] = useState([]); // To track items added to the cart

  const selectedFinancial = useMemo(
    () =>
      selectedDetail?.financials.find(
        (financial) => financial.quantity.toString() === selectedQuantity
      ),
    [selectedDetail, selectedQuantity]
  );

  const relatedProducts = useMemo(() => {
    const products = categoryData?.products || [];
    return products
      .filter((item) => item._id !== product?._id)
      .slice(0, 6);
  }, [categoryData, product]);

  const productMeta = useMemo(() => {
    if (!product) {
      return {
        title: 'Mana Kirana Product | Online Grocery Delivery',
        description: 'Shop grocery products online from Mana Kirana.',
        image: `${SITE_URL}/images/logoSquare512_v1.webp`,
        jsonLd: null,
      };
    }

    const firstDetail = selectedDetail || product.details?.[0];
    const firstFinancial = selectedFinancial || firstDetail?.financials?.[0];
    const image = firstDetail?.images?.[0]?.image || `${SITE_URL}/images/logoSquare512_v1.webp`;
    const title = `${product.name} | ${product.category} | Mana Kirana`;
    const description = `Buy ${product.name} online from Mana Kirana. Shop ${product.category} with grocery home delivery.`;

    return {
      title,
      description,
      image,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image,
        description,
        category: product.category,
        brand: firstDetail?.brand,
        offers: firstFinancial ? {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: Number(firstFinancial.dprice || firstFinancial.price || 0).toFixed(2),
          availability: Number(firstFinancial.countInStock || 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/product/${product.slug}`,
        } : undefined,
      },
    };
  }, [product, selectedDetail, selectedFinancial]);

  // Update selected detail whenever the selected brand or product data changes
  useEffect(() => {
    if (product && selectedBrand) {
      const detail = product.details.find((detail) => detail.brand === selectedBrand);
      if (detail) {
        setSelectedDetail(detail);
        if (detail.financials && detail.financials.length > 0) {
          const hasSelectedQuantity = detail.financials.some(
            (financial) => financial.quantity.toString() === selectedQuantity
          );
          if (!hasSelectedQuantity) {
            setSelectedQuantity(detail.financials[0].quantity.toString());
          }
        }
      }
    }
  }, [product, selectedBrand, selectedQuantity]);
  

  // Reset "Added to Cart" when quantity, brand, or qty changes
  useEffect(() => {
    // Check if the current selection is already added to the cart
    const isItemInCart = cartState.some(
      (item) => item.brand === selectedBrand && item.quantity === selectedQuantity && item.qty === selectedQty
    );
    setAddedToCart(isItemInCart);
  }, [selectedBrand, selectedQuantity, selectedQty, cartState]);

  const handleBrandChange = (event) => {
    const newBrand = event.target.value;
    setSelectedBrand(newBrand);
    setAddedToCart(false); // Reset the state on brand change
  };

  const handleQtyChange = (event) => {
    setSelectedQty(event.target.value);
    setAddedToCart(false); // Reset the state on qty change
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
    setAddedToCart(false); // Reset the state on quantity change
  };

  const addToCartHandler = () => {
    if (!selectedDetail) {
      alert('Selected brand details are not available.');
      return;
    }

    if (!selectedFinancial) {
      alert('Selected quantity details are not available.');
      return;
    }

    dispatch(
      addToCart({
        name: product.name,
        productId: product._id,
        slug: product.slug,
        category: product.category,
        brand: selectedBrand,
        quantity: selectedQuantity,
        price: selectedFinancial.price,
        units: selectedFinancial?.units,
        dprice: selectedFinancial.dprice,
        Discount: selectedFinancial.Discount,
        image: selectedDetail.images[0]?.image,
        qty: selectedQty,
        financialId: selectedFinancial._id,
        brandId: selectedDetail._id,
        countInStock: 10,
      })
    );

    setAddedToCart(true); // Set "Added to Cart" to true
    setCartState([
      ...cartState,
      { brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }
    ]); // Add this item to the cart state
  };

  const goBackHandler = () => {
    navigate(-1); // Go back to the previous page in the browser history
  };


  useEffect(() => {
    if (product && product.details.length > 0) {
      const requestedBrand = brand || product.details[0].brand;
      setSelectedBrand(requestedBrand);
    }
  }, [product, brand]);
    

  return (
    <div className="mt-24 mb-24">
      <Meta
        title={productMeta.title}
        description={productMeta.description}
        keywords={`${product?.name || 'grocery product'}, ${product?.category || 'online grocery'}, Mana Kirana`}
        canonical={`${SITE_URL}/product/${slug}`}
        url={`${SITE_URL}/product/${slug}`}
        image={productMeta.image}
        type="product"
        jsonLd={productMeta.jsonLd}
      />
      <button
        onClick={goBackHandler}
        className="mb-4 inline-flex rounded-md border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
      >
        Go Back
      </button>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {product && product.details && selectedDetail && (
            <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="grid gap-5 p-4 md:grid-cols-[minmax(280px,420px)_1fr] md:p-6">
                <div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    {selectedDetail.images &&
                      selectedDetail.images.map((image, imageIndex) => (
                        <img
                          key={imageIndex}
                          src={image.image}
                          alt={`${product.name}`}
                          className="mx-auto block h-72 w-full max-w-md rounded object-contain"
                        />
                      ))}
                  </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-green-700">{selectedBrand}</p>
                    <h1 className="mt-1 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                      {product.name}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">Freshly packed grocery item available for quick delivery.</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <label htmlFor="brandDropdown" className="mb-1 block text-sm font-medium text-gray-700">
                        Brand
                      </label>
                      <div className="relative">
                        <select
                          id="brandDropdown"
                          className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-2.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                          onChange={handleBrandChange}
                          value={selectedBrand}
                        >
                          {product.details.map((detail) => (
                            <option key={detail.brand} value={detail.brand}>
                              {detail.brand}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="weightDropdown" className="mb-1 block text-sm font-medium text-gray-700">
                        Weight
                      </label>
                      <div className="relative">
                        <select
                          id="weightDropdown"
                          className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-2.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                          onChange={handleQuantityChange}
                          value={selectedQuantity}
                        >
                          {selectedDetail?.financials.map((financial, index) => (
                            <option key={index} value={financial.quantity}>
                              {financial.quantity}
                              {financial.units}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quantityDropdown" className="mb-1 block text-sm font-medium text-gray-700">
                        Packs
                      </label>
                      <div className="relative">
                        <select
                          id="quantityDropdown"
                          className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-2.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                          onChange={handleQtyChange}
                          value={selectedQty}
                        >
                          {[...Array(10).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Price per pack</p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            &#x20b9;{getDprice(selectedQuantity, selectedDetail?.financials).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            &#x20b9;{getPrice(selectedQuantity, selectedDetail?.financials).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {getDiscount(selectedQuantity, selectedDetail?.financials) > 0 && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                          {getDiscount(selectedQuantity, selectedDetail?.financials)}% Off
                        </span>
                      )}
                    </div>
                    {selectedQty > 1 && (
                      <p className="mt-3 text-sm text-gray-700">
                        Total for {selectedQty} packs:{' '}
                        <span className="font-bold text-green-800">
                          &#x20b9;{(getDprice(selectedQuantity, selectedDetail?.financials) * selectedQty).toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>

                  <button
                    className={`rounded-md px-4 py-3 text-sm font-semibold text-white transition ${
                      addedToCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                    }`}
                    onClick={addToCartHandler}
                    disabled={addedToCart}
                  >
                    {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </section>
          )}

          {relatedProducts.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">You may also like</h2>
              <div className="grid grid-cols-2 gap-1 rounded-md bg-gray-200 p-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
                {relatedProducts.map((relatedProduct) => (
                  <Product key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default ProductScreen;

// Helper functions for price and discount calculations
const getPrice = (selectedQuantity, financials) => {
  if (!financials) return 0;
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.price : 0;
};

const getDprice = (selectedQuantity, financials) => {
  if (!financials) return 0;
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.dprice : 0;
};

const getDiscount = (selectedQuantity, financials) => {
  if (!financials) return 0;
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.Discount : 0;
};
