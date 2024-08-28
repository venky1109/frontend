import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
// import { FaShoppingBag } from 'react-icons/fa';
import { FaCartPlus } from "react-icons/fa6";
import FloatingCartIcon from './FloatingCartIcon'; 

const Product = ({ product, keyword }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  // const [isAddedToCart, setIsAddedToCart] = useState(false);
  const productImageRefs = useRef([]); // Array of refs for each product
  const floatingCartIconRef = useRef(null);

  // const isDown = useRef(false); 
  // const startX = useRef(0); 
  // const scrollLeft = useRef(0); 
  const scrollContainersRef = useRef({});
  const selectedButtonsRef = useRef({});
  const dispatch = useDispatch();

  const calculateMaxDiscount = useCallback(
    (brand) => {
      const brandDetails = product.details.filter((detail) => detail.brand === brand);
      return brandDetails.reduce(
        (max, detail) =>
          Math.max(max, ...detail.financials.map((financial) => parseFloat(financial.Discount))),
        0
      );
    },
    [product.details]
  );

  const maxDiscountQuantity = useMemo(
    () => (brand) => {
      const brandDetails = product.details.filter((detail) => detail.brand === brand);
      return brandDetails.reduce(
        (max, detail) =>
          Math.max(max, ...detail.financials.map((financial) => parseFloat(financial.quantity))),
        0
      );
    },
    [product.details]
  );

  const getBrandWithHighestDiscount = useMemo(() => {
    return product.details.reduce((bestBrand, detail) => {
      const discount = calculateMaxDiscount(detail.brand);
      return discount > bestBrand.discount ? { brand: detail.brand, discount } : bestBrand;
    }, { brand: '', discount: 0 }).brand;
  }, [product.details, calculateMaxDiscount]);

  useEffect(() => {
    const brand = keyword
      ? product.details.find((detail) => detail.brand.toLowerCase().includes(keyword.toLowerCase()))?.brand
      : getBrandWithHighestDiscount;

    const quantity = maxDiscountQuantity(brand);

    setSelectedBrand(brand);
    setSelectedQuantity(quantity.toString());
  }, [keyword, product.details, getBrandWithHighestDiscount, maxDiscountQuantity]);

  const scrollToSelectedButton = (detailIndex) => {
    const button = selectedButtonsRef.current[detailIndex];
    const scrollContainer = scrollContainersRef.current[detailIndex];

    if (button && scrollContainer) {
      const buttonRelativePosition = button.offsetLeft - scrollContainer.offsetLeft;
      const isButtonFullyVisible =
        buttonRelativePosition >= 0 &&
        buttonRelativePosition + button.clientWidth <= scrollContainer.clientWidth;

      if (!isButtonFullyVisible) {
        scrollContainer.scrollTo({
          left: scrollContainer.scrollLeft + buttonRelativePosition,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    Object.keys(selectedButtonsRef.current).forEach((detailIndex) => {
      scrollToSelectedButton(detailIndex);
    });
  }, [selectedBrand]);

  const handleBrandChange = (detailIndex, brand) => {
    setSelectedBrand(brand);
    setSelectedQuantity(maxDiscountQuantity(brand).toString());
    setSelectedQty(1);
    setShowQuantityControls(false);
    scrollToSelectedButton(detailIndex);
  };

  const handleQuantityChange = (quantity) => {
    setSelectedQuantity(quantity);
    setSelectedQty(1);
    setShowQuantityControls(false);
  };

  const handleQtyChange = (newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQty(newQty);
      addToCartHandler();
    }
  };

  const addToCartHandler = (index) => {
    const selectedDetail = product.details.find((detail) => detail.brand === selectedBrand) || {};
    const selectedFinancial = selectedDetail.financials?.find(
      (financial) => financial.quantity.toString() === selectedQuantity.toString()
    );
    const imageElement = productImageRefs.current[index]; // Get the specific ref for the clicked product
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
      clonedImage.style.transition = 'all 0.75s ease'; // Smooth transition
      clonedImage.style.borderRadius = '50%'; // Make the cloned image rounded
      clonedImage.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // Add a shadow to enhance the round effect


      document.body.appendChild(clonedImage);

      requestAnimationFrame(() => {
        clonedImage.style.left = `${cartRect.left + cartRect.width / 2 - imageRect.width / 4}px`; // Centered on cart icon
        clonedImage.style.top = `${cartRect.top + cartRect.height / 2 - imageRect.height / 4}px`; // Centered on cart icon
        clonedImage.style.width = `${imageRect.width / 2}px`; // Decrease size
        clonedImage.style.height = `${imageRect.height / 2}px`; // Decrease size
        clonedImage.style.opacity = '0.7'; // Adjust opacity for smooth effect
        clonedImage.style.transform = 'scale(0.5)'; // Scale down the image
      });

      clonedImage.addEventListener('transitionend', () => {
        clonedImage.remove();
      });
    }

    dispatch(addToCart({
      name: product.name,
      productId: product._id,
      category: product.category,
      brand: selectedBrand,
      quantity: selectedQuantity,
      price: selectedFinancial ? selectedFinancial.price : 0,
      dprice: selectedFinancial ? selectedFinancial.dprice : 0,
      Discount: selectedFinancial ? selectedFinancial.Discount : 0,
      image: selectedDetail?.images ? selectedDetail.images[0].image : '',
      qty: selectedQty,
      financialId: selectedFinancial?._id,
      brandId: selectedDetail?._id,
      countInStock: 10
    }));
     // Update state to show quantity controls
     setShowQuantityControls(true);
  };

  const handleMouseInteraction = (e, index, action) => {
    const scrollContainer = scrollContainersRef.current[index];
    if (!scrollContainer) return;

    if (action === 'down') {
      scrollContainer.classList.add('active');
      scrollContainer.dataset.startX = e.pageX - scrollContainer.offsetLeft;
      scrollContainer.dataset.scrollLeft = scrollContainer.scrollLeft;
    } else if (action === 'move') {
      if (!scrollContainer.classList.contains('active')) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - scrollContainer.dataset.startX) * 2;
      scrollContainer.scrollLeft = scrollContainer.dataset.scrollLeft - walk;
    } else {
      scrollContainer.classList.remove('active');
    }
  };

  return (
    <><div className="flex flex-wrap gap-4 justify-center">
      {product.details.map((detail, detailIndex) => (!selectedBrand || detail.brand === selectedBrand) && (
        <div
          key={detailIndex}
          className="border border-gray-300 rounded-lg p-2 shadow-md transition-transform duration-200 ease-in-out flex flex-col bg-white w-full h-full max-w-xs"
        >
          <Link
            to={`/product/${product._id}`}
            state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}
          >
            <div className="relative overflow-hidden border border-gray-300 rounded-lg h-32">
              {detail.images?.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.image}
                  ref={el => productImageRefs.current[detailIndex] = el} // Assign ref for each image
                  className="w-full h-full object-cover transition-transform duration-250 ease-in-out transform hover:scale-110"
                  alt={`${product.name}`}
                  onLoad={(e) => e.target.style.visibility = 'visible'} // Ensure image is visible when loaded
                  style={{ visibility: 'hidden' }} // Hide image until fully loaded
                />
              ))}
              {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <div className="absolute top-2 left-2 bg-green-700 text-white px-1 py-0.5 rounded-lg text-xs">
                  <p>{getDiscount(selectedQuantity, detail.financials)}% off</p>
                </div>
              )}
            </div>
          </Link>

          <div className="mt-2 text-center flex-1 flex flex-col justify-between">
            <p className="text-sm font-semibold text-maroon-600">{product.name}</p>

            <div className="flex flex-col mt-1 space-y-1">
              {/* Brand Scroll */}
              <div className="flex items-center">
                <div
                  ref={(el) => (scrollContainersRef.current[detailIndex] = el)}
                  className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide"
                  onMouseDown={(e) => handleMouseInteraction(e, detailIndex, 'down')}
                  onMouseLeave={() => handleMouseInteraction(null, detailIndex, 'up')}
                  onMouseUp={() => handleMouseInteraction(null, detailIndex, 'up')}
                  onMouseMove={(e) => handleMouseInteraction(e, detailIndex, 'move')}
                >
                  {product.details.map((brandDetail) => (
                    <button
                      key={brandDetail.brand}
                      ref={(el) => {
                        if (brandDetail.brand === selectedBrand) selectedButtonsRef.current[detailIndex] = el;
                      } }
                      onClick={() => handleBrandChange(detailIndex, brandDetail.brand)}
                      className={`px-2 py-0.5 rounded-lg border ${selectedBrand === brandDetail.brand
                          ? 'bg-gray-100 text-black border-gray-500'
                          : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'} whitespace-nowrap text-xs`}
                      aria-label={`Select brand ${brandDetail.brand}`}
                    >
                      {brandDetail.brand}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide w-full">
                  {detail.financials.map((financial, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuantityChange(financial.quantity.toString())}
                      className={`px-2 py-0.5 rounded-lg border ${selectedQuantity === financial.quantity.toString()
                          ? 'bg-gray-100 text-black border-gray-500'
                          : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'} text-xs`}
                    >
                      {getFormattedQuantity(financial.quantity)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grouped Price, Cart, Quantity Controls, and Multiple Qty Price */}
              <div className="flex items-center justify-between mt-2 space-x-2">
                {/* Price and Multiple Qty Price Group */}
                <div className="flex flex-col ml-3">
                  <div className="text-sm text-gray-900">
                    {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 ? (
                      <>
                        <span className="line-through text-gray-400">
                          &#x20b9;{getPrice(selectedQuantity, detail.financials).toFixed(2)}
                        </span>
                        <span className=" bg-gray-100 font-semibold text-black-700">
                          &#x20b9;{getDprice(selectedQuantity, detail.financials).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span>&#x20b9;{getPrice(selectedQuantity, detail.financials).toFixed(2)}</span>
                    )}
                  </div>

                  {/* Price for Multiple Packs */}
                  {selectedQuantity && selectedQty > 1 && (
                    <div className=" text-sm font-medium text-gray-800">
                      {selectedQty}xpacks{' '}
                      <span className=" text-green-900">
                        &#x20b9;{(getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cart and Quantity Controls */}
                <div className="flex items-center space-x-2">
                  {showQuantityControls ? (
                    <div className="flex m-3 bg-green-700 items-center space-x-1 rounded-lg transition-transform transform hover:scale-105 active:scale-95 text-sm">
                      <button
                        className="text-white px-2 py-0.5 "
                        onClick={() => handleQtyChange(selectedQty - 1)}
                        aria-label="Decrease Quantity"
                      >
                        -
                      </button>
                      <span className="text-sm text-white  font-semibold">{selectedQty}</span>
                      <button
                        className="text-white px-2 py-0.5  "
                        onClick={() => handleQtyChange(selectedQty + 1)}
                        aria-label="Increase Quantity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="ml-auto flex items-center justify-center bg-gray-100 p-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
                      onClick={() => addToCartHandler(detailIndex)} 
                      aria-label="Add Product to Cart"
                    >
                      {/* <FaShoppingBag className="w-8 h-8 text-gray-700" /> */}
                      <FaCartPlus  className="w-8 h-8 text-green-800" /> 
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      )}
    </div><FloatingCartIcon ref={floatingCartIconRef} /></>
  
  );
};

export default Product;

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

const getFormattedQuantity = (quantity) => {
  return !isNaN(quantity) ? (quantity > 30 ? `${quantity} grams` : `${quantity} Kg`) : 'N/A';
};
