import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
  const { slug } = useParams();  // ✅ Extract slug from URL
  // console.log("Extracted Slug:", slug);  // ✅ Debugging log
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const scrollContainersRef = useRef([]);
  const { brand, quantity, qty } = location.state || {};

  // const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const { data: product, isLoading, error } = useGetProductDetailsQuery(slug);
  // console.log("Product Object:", product); 


  const [selectedBrand, setSelectedBrand] = useState(brand || '');
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || '1');
  const [selectedQty, setSelectedQty] = useState(qty || '1');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false); // State for tracking "Added to Cart"

  const [cartState, setCartState] = useState([]); // To track items added to the cart

  // Update selected detail whenever the selected brand or product data changes
  useEffect(() => {
    if (product && selectedBrand) {
      const detail = product.details.find((detail) => detail.brand === selectedBrand);
      if (detail) {
        setSelectedDetail(detail);
        if (detail.financials && detail.financials.length > 0) {
          setSelectedQuantity(detail.financials[0].quantity.toString());
        }
      }
    }
  }, [product, selectedBrand]);
  

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

  const handleSimilarItemClick = (brand, quantity) => {
    window.scrollTo(0, 0);
    setSelectedBrand(brand);
    setSelectedQuantity(quantity);
    setAddedToCart(false); // Reset the state on similar item click
  };

  const addToCartHandler = () => {
    if (!selectedDetail) {
      alert('Selected brand details are not available.');
      return;
    }

    const selectedFinancial = selectedDetail.financials.find(
      (financial) => financial.quantity.toString() === selectedQuantity
    );

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
      setSelectedBrand(product.details[0].brand); // Default to the first brand for the new product
    }
  }, [product]);
    

  return (
    <div className="mt-24">
      <button
        onClick={goBackHandler}
        className="text-green-600 hover:text-green-800 p-2 border border-green-600 rounded mb-4 inline-block"
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
            <div className="mt-10 mb-20 flex flex-col md:flex-row items-start md:items-center  gap-4 p-4 border-b border-gray-200">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <h4 className="text-2xl font-semibold text-center text-green-700 mb-4 mt-2">
                  {selectedBrand} {product.name}
                </h4>
                <Link
                  to={`/product/${product.slug}`}
                  state={{ brand: selectedBrand, quantity: selectedQuantity }}
                >
                  <div className="relative overflow-hidden">
                    <div
                      className="flex space-x-2"
                      ref={(el) => (scrollContainersRef.current[0] = el)}
                    >
                      {selectedDetail.images &&
                        selectedDetail.images.map((image, imageIndex) => (
                          <img
                            key={imageIndex}
                            src={image.image}
                            alt={`${product.name}`}
                            className="w-full h-64 object-cover rounded"
                          />
                        ))}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="w-full md:w-2/3 flex flex-col space-y-4">
                <div>
                  <label htmlFor="brandDropdown" className="text-sm font-medium text-green-700">
                    Brand:
                  </label>
                  <select
                    id="brandDropdown"
                    className="w-full border border-green-500 rounded mt-1 p-2"
                    onChange={handleBrandChange}
                    value={selectedBrand}
                  >
                    {product.details.map((detail) => (
                      <option key={detail.brand} value={detail.brand}>
                        {detail.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="weightDropdown" className="text-sm font-medium text-green-700">
                    Weight:
                  </label>
                  <select
                    id="weightDropdown"
                    className="w-full border border-green-500 rounded mt-1 p-2"
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
                </div>

                <div>
                  <label htmlFor="quantityDropdown" className="text-sm font-medium text-green-700">
                    Number Of Packs:
                  </label>
                  <select
                    id="quantityDropdown"
                    className="w-full border border-green-500 rounded mt-1 p-2"
                    onChange={handleQtyChange}
                    value={selectedQty}
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="text-green-700">MRP:</span>{' '}
                    <span className="line-through text-gray-500">
                      &#x20b9;{getPrice(selectedQuantity, selectedDetail?.financials).toFixed(2)}
                    </span>
                    <span className="text-green-700"> (Per Pack)</span>
                  </div>
                  <div>
                    <span className="text-green-700">Discount Price:</span>{' '}
                    <span className="text-green-700 font-semibold">
                      &#x20b9;{getDprice(selectedQuantity, selectedDetail?.financials).toFixed(2)}
                    </span>
                    <span className="text-green-700"> (Per Pack)</span>
                  </div>
                  {getDiscount(selectedQuantity, selectedDetail?.financials) > 0 && (
                    <div>
                      <span className="text-green-700">Discount:</span>{' '}
                      <span className="text-red-500 font-semibold">
                        {getDiscount(selectedQuantity, selectedDetail?.financials)}% Off
                      </span>
                    </div>
                  )}
                  {selectedQty > 1 && (
                    <div>
                      <span className="text-green-700">Price for {selectedQty} Packs:</span>{' '}
                      <span className="text-green-700 font-semibold">
                        &#x20b9;{(getDprice(selectedQuantity, selectedDetail?.financials) * selectedQty).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`p-2 rounded transition ${
                    addedToCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                  onClick={addToCartHandler}
                  disabled={addedToCart}
                >
                  {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )}

          {/* Similar Items Section */}
          {product.details.length > 1 && (
            <div className="mt-10 mb-20">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Similar Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {product.details
                  .filter((detail) => detail.brand !== selectedBrand)
                  .map((detail) => {
                    const financials = detail.financials;
                    const quantity = financials[0]?.quantity.toString();
                    const discount = getDiscount(quantity, financials);

                    return (
                      <div
                        key={detail.brand}
                        className="border border-gray-200 p-4 rounded-lg shadow-md cursor-pointer"
                        onClick={() => handleSimilarItemClick(detail.brand, quantity)}
                      >
                        <Link
                          to={`/product/${product.slug}`}
                          state={{ brand: detail.brand, quantity: quantity }}
                        >
                          <img
                            src={detail.images[0]?.image}
                            alt={detail.brand}
                            className="w-full h-40 object-cover mb-4 rounded"
                          />
                          <h4 className="text-lg font-semibold text-green-700">{detail.brand}</h4>
                          {discount > 0 && (
                            <div>
                              <span className="text-green-700">Discount:</span>{' '}
                              <span className="text-red-500 font-semibold">
                                {discount}% Off
                              </span>
                            </div>
                          )}
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
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
