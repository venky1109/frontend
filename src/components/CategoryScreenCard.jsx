import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa6";
import FloatingCartIcon from './FloatingCartIcon';

const CategoryScreenCard = ({ product }) => {
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [selectedQtys, setSelectedQtys] = useState({});
  const [showQuantityControls, setShowQuantityControls] = useState({});
  const productImageRefs = useRef([]);
  const floatingCartIconRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initialQuantities = {};
    const initialQtys = {};
    const initialShowControls = {};

    product.details.forEach((detail, index) => {
      const firstQuantity = detail.financials[0]?.quantity.toString();
      initialQuantities[index] = firstQuantity;
      initialQtys[index] = 1;
      initialShowControls[index] = false;
    });

    setSelectedQuantities(initialQuantities);
    setSelectedQtys(initialQtys);
    setShowQuantityControls(initialShowControls);
  }, [product.details]);

  const handleQuantityChange = (detailIndex, quantity) => {
    setSelectedQuantities((prevState) => ({
      ...prevState,
      [detailIndex]: quantity
    }));
    setSelectedQtys((prevState) => ({
      ...prevState,
      [detailIndex]: 1
    }));
    setShowQuantityControls((prevState) => ({
      ...prevState,
      [detailIndex]: false
    }));
  };

  const handleQtyChange = (detailIndex, newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQtys((prevState) => ({
        ...prevState,
        [detailIndex]: newQty
      }));
      // Dispatch to add to cart whenever quantity changes
      const detail = product.details[detailIndex];
      const selectedQuantity = selectedQuantities[detailIndex];
      const selectedFinancial = detail.financials.find(financial => financial.quantity.toString() === selectedQuantity);
      dispatch(addToCart({
        name: product.name,
        productId: product._id,
        category: product.category,
        brand: detail.brand,
        quantity: selectedQuantity,
        units: selectedFinancial?.units,
        price: selectedFinancial ? selectedFinancial.price : 0,
        dprice: selectedFinancial ? selectedFinancial.dprice : 0,
        Discount: selectedFinancial ? selectedFinancial.Discount : 0,
        image: detail.images[0]?.image,
        qty: newQty,
        financialId: selectedFinancial?._id,
        brandId: detail._id,
        countInStock: 10,
      }));
    }
  };

  const addToCartHandler = (detailIndex, detail) => {
    const selectedQuantity = selectedQuantities[detailIndex];
    const selectedFinancial = detail.financials.find(financial => financial.quantity.toString() === selectedQuantity);

    const imageElement = productImageRefs.current[detailIndex];
    const cartElement = floatingCartIconRef.current;

    if (imageElement && cartElement) {
      const imageRect = imageElement.getBoundingClientRect();
      const cartRect = cartElement.getBoundingClientRect();

      const clonedImage = imageElement.cloneNode(true);
      clonedImage.style.position = 'fixed';
      clonedImage.style.left = `${imageRect.left}px`;
      clonedImage.style.top = `${imageRect.top}px`;
      clonedImage.style.width = `${imageRect.width}px`;
      clonedImage.style.height = `${imageRect.height}px`;
      clonedImage.style.transition = 'all 0.75s ease';
      clonedImage.style.borderRadius = '50%';
      clonedImage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

      document.body.appendChild(clonedImage);

      requestAnimationFrame(() => {
        clonedImage.style.left = `${cartRect.left + cartRect.width / 2 - imageRect.width / 4}px`;
        clonedImage.style.top = `${cartRect.top + cartRect.height / 4}px`;
        clonedImage.style.width = `${imageRect.width / 2}px`;
        clonedImage.style.height = `${imageRect.height / 2}px`;
        clonedImage.style.opacity = '0.7';
        clonedImage.style.transform = 'scale(0.5)';
      });

      clonedImage.addEventListener('transitionend', () => {
        clonedImage.remove();
      });
    }

    dispatch(addToCart({
      name: product.name,
      productId: product._id,
      category: product.category,
      brand: detail.brand,
      quantity: selectedQuantity,
      units: selectedFinancial?.units,
      price: selectedFinancial ? selectedFinancial.price : 0,
      dprice: selectedFinancial ? selectedFinancial.dprice : 0,
      Discount: selectedFinancial ? selectedFinancial.Discount : 0,
      image: detail.images[0]?.image,
      qty: selectedQtys[detailIndex],
      financialId: selectedFinancial?._id,
      brandId: detail._id,
      countInStock: 10,
    }));

    setShowQuantityControls((prevState) => ({
      ...prevState,
      [detailIndex]: true
    }));
  };

  return (
    <>
      {product.details.map((detail, detailIndex) => (
        <div key={`${product._id}-${detail.brand}`} className="border border-gray-300 rounded-lg p-2 shadow-md transition-transform duration-200 ease-in-out flex flex-col bg-white w-full h-full max-w-xs">
          <Link to={`/product/${product._id}`} state={{ brand: detail.brand, quantity: selectedQuantities[detailIndex], qty: selectedQtys[detailIndex] }}>
            <div className="relative overflow-hidden border border-gray-300 rounded-lg h-32">
              {detail.images?.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.image}
                  ref={el => productImageRefs.current[detailIndex] = el}
                  className="w-full h-full object-cover transition-transform duration-250 ease-in-out transform hover:scale-110"
                  alt={`${product.name}`}
                />
              ))}
              <span className="absolute top-2 left-2 bg-green-700 text-white px-1 py-0.5 rounded-lg text-xs">
                {getDiscount(selectedQuantities[detailIndex], detail.financials)}% off
              </span>
            </div>
          </Link>

          <div className="mt-2 text-center flex-1 flex flex-col justify-between">
            <p className="text-sm font-serif text-maroon-600">{detail.brand}</p>

            {/* Display Units and Quantity Options */}
            <div className="flex items-center">
              <div className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide w-full">
                {detail.financials.map((financial, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuantityChange(detailIndex, financial.quantity.toString())}
                    className={`px-2 py-0.5 rounded-lg border ${selectedQuantities[detailIndex] === financial.quantity.toString()
                      ? 'bg-gray-100 text-black border-gray-500'
                      : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'} text-xs`}
                  >
                    {financial.quantity}{financial.units}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Information */}
            <div className="flex items-center justify-between mt-2 space-x-2">
              {/* Price and Multiple Qty Price Group */}
              <div className="flex flex-col ml-3">
                <div className="text-sm text-gray-900">
                  {selectedQuantities[detailIndex] && getDiscount(selectedQuantities[detailIndex], detail.financials) > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        &#x20b9;{getPrice(selectedQuantities[detailIndex], detail.financials).toFixed(2)}
                      </span> 
                      <span className="bg-gray-100 font-semibold text-black-700">
                        &#x20b9;{getDprice(selectedQuantities[detailIndex], detail.financials).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>&#x20b9;{getPrice(selectedQuantities[detailIndex], detail.financials).toFixed(2)}</span>
                  )}
                </div>

                {/* Price for Multiple Packs */}
                {selectedQtys[detailIndex] > 1 && (
                  <div className="text-xs font-small font-bold text-gray-800">
                    {selectedQtys[detailIndex]}x Packs{' '}
                    <span className="text-green-900">
                      &#x20b9;{(getDprice(selectedQuantities[detailIndex], detail.financials) * selectedQtys[detailIndex]).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Cart and Quantity Controls */}
              <div className="flex items-center space-x-2">
                {showQuantityControls[detailIndex] ? (
                  <div className="flex m-3 bg-green-700 items-center space-x-1 rounded-lg transition-transform transform hover:scale-105 active:scale-95 text-sm">
                    <button
                      className="text-white px-2 py-0.5"
                      onClick={() => handleQtyChange(detailIndex, selectedQtys[detailIndex] - 1)}
                      aria-label="Decrease Quantity"
                    >
                      -
                    </button>
                    <span className="text-sm text-white font-semibold">{selectedQtys[detailIndex]}</span>
                    <button
                      className="text-white px-2 py-0.5"
                      onClick={() => handleQtyChange(detailIndex, selectedQtys[detailIndex] + 1)}
                      aria-label="Increase Quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="ml-auto flex items-center justify-center bg-gray-100 p-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
                    onClick={() => addToCartHandler(detailIndex, detail)}
                    aria-label="Add Product to Cart"
                  >
                    <FaCartPlus className="w-8 h-8 text-green-800" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <FloatingCartIcon ref={floatingCartIconRef} />
    </>
  );
};

export default CategoryScreenCard;

// Helper functions for price and discount calculations
const getPrice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity
  );
  return selectedFinancial ? selectedFinancial.price : 0;
};

const getDprice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity
  );
  return selectedFinancial ? selectedFinancial.dprice : 0;
};

const getDiscount = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity
  );
  return selectedFinancial ? selectedFinancial.Discount : 0;
};

