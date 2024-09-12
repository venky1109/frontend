import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Scroll to the top of the page when the component is mounted
    window.scrollTo(0, 0);
  }, []);
  const location = useLocation();
  const scrollContainersRef = useRef([]);
  const { brand, quantity, qty } = location.state || {};

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const [selectedBrand, setSelectedBrand] = useState(brand || '');
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || '1');
  const [selectedQty, setSelectedQty] = useState(qty || '1');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Update selected detail whenever the selected brand or product data changes
  useEffect(() => {
    if (product && selectedBrand) {
      const detail = product.details.find((detail) => detail.brand === selectedBrand);
      setSelectedDetail(detail);
      if (detail && detail.financials.length > 0) {
        setSelectedQuantity(detail.financials[0].quantity.toString());
      }
    }
  }, [selectedBrand, product]);

  const handleBrandChange = (event) => {
    const newBrand = event.target.value;
    setSelectedBrand(newBrand);
  };

  const handleQtyChange = (event) => {
    setSelectedQty(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
  };

  const handleSimilarItemClick = (brand, quantity) => {
    setSelectedBrand(brand);
    setSelectedQuantity(quantity);
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
        category: product.category,
        brand: selectedBrand,
        quantity: selectedQuantity,
        price: selectedFinancial.price,
        dprice: selectedFinancial.dprice,
        Discount: selectedFinancial.Discount,
        image: selectedDetail.images[0]?.image,
        qty: selectedQty,
        financialId: selectedFinancial._id,
        brandId: selectedDetail._id,
        countInStock: 10,
      })
    );

    navigate('/cart');
  };

  const goBackHandler = () => {
    navigate(-1); // Go back to the previous page in the browser history
  };

  return (
    <div className="mt-24">
 <button onClick={goBackHandler} className="text-green-600 hover:text-green-800 p-2 border border-green-600 rounded mb-4 inline-block">
          Go Back
        </button>
  {isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      {/* Main Product Section */}
      {selectedDetail && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4  border-b border-gray-200">
          {/* Image Section */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <h4 className="text-2xl font-semibold text-center text-green-700 mb-4 mt-2">
              {selectedBrand} {product.name}
            </h4>
            <Link
              to={`/product/${product._id}`}
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

          {/* Details Section */}
          <div className="w-full md:w-2/3 flex flex-col space-y-4">
            {/* Brand Selector */}
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

            {/* Weight Selector */}
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

            {/* Quantity Selector */}
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

            {/* Price Information */}
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
              {/* Show discount percentage if available */}
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
              className="bg-green-500 text-white rounded p-2 hover:bg-green-600 transition"
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Similar Items Section at the Bottom */}
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
          // const dprice = getDprice(quantity, financials);

          return (
            <div
              key={detail.brand}
              className="border border-gray-200 p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleSimilarItemClick(detail.brand, quantity)}
            >
              <Link
                to={`/product/${product._id}`}
                state={{ brand: detail.brand, quantity: quantity }}
              >
                <img
                  src={detail.images[0]?.image}
                  alt={detail.brand}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h4 className="text-lg font-semibold text-green-700">{detail.brand}</h4>
                {/* Show discount percentage if available */}
                {discount > 0 && (
                  <div>
                    <span className="text-green-700">Discount:</span>{' '}
                    <span className="text-red-500 font-semibold">
                      {discount}% Off
                    </span>
                  </div>
                )}
                {/* <div>
                  <span className="text-green-700">Discount Price:</span>{' '}
                  <span className="text-green-700 font-semibold">
                    &#x20b9;{dprice.toFixed(2)}
                  </span>
                  <span className="text-green-700"> (Per Pack)</span>
                </div> */}
              </Link>
            </div>
          );
        })}
    </div>
  </div>
)}


{/* Before Changes:
Previously, the discount price and percentage were calculated based on the currently selected brand's details (selectedDetail), leading to incorrect values for the similar items.

After Changes:
Each similar item now displays:

Its unique discount percentage (discount).
Its independent discounted price (dprice).
These values are calculated based on the financials array associated with that specific item's brand. */}

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
;
