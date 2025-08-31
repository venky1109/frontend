import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa6";
import FloatingCartIcon from './FloatingCartIcon';

const Product = ({ product, keyword }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const productImageRefs = useRef([]); // Array of refs for each product
  const floatingCartIconRef = useRef(null);

  const scrollContainersRef = useRef({});
  const quantityScrollContainersRef = useRef({}); // Refs for quantity scroll containers
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
    // Check if a keyword was provided and filter brand based on that, else use the memoized brand with the highest discount
    let brand = keyword
      ? product.details.find((detail) => detail.brand.toLowerCase().includes(keyword.toLowerCase()))?.brand
      : getBrandWithHighestDiscount;  // Use the memoized value directly, not as a function

    // If no brand is found, pick the first available brand
    if (!brand) {
      brand = product.details[0]?.brand || ''; // Set the first brand as default
    }

    // Get the quantity for the selected brand
    let quantity = maxDiscountQuantity(brand);

    // If no valid quantity is found or quantity is zero, select the first available quantity
    if (!quantity || quantity === 0) {
      const firstDetail = product.details.find((detail) => detail.brand === brand);
      quantity = firstDetail ? firstDetail.financials[0]?.quantity : ''; // Set the first available quantity as default
    }

    // Set the selected brand and quantity
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

  const handleQtyChange = useCallback((newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQty(newQty);
    }
  }, []);
  const addToCartHandler = useCallback((index) => {
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
        clonedImage.style.transform = 'scale(1)';
      });

      clonedImage.addEventListener('transitionend', () => {
        clonedImage.remove();
      });
    }

    dispatch(addToCart({
      name: product.name,
      productId: product._id,
      slug: product.slug,
      category: product.category,
      brand: selectedBrand,
      quantity: selectedQuantity,
      units: selectedFinancial.units,
      price: selectedFinancial ? selectedFinancial.price : 0,
      dprice: selectedFinancial ? selectedFinancial.dprice : 0,
      Discount: selectedFinancial ? selectedFinancial.Discount : 0,
      image: selectedDetail?.images ? selectedDetail.images[0].image : '',
      qty: selectedQty,
      financialId: selectedFinancial?._id,
      brandId: selectedDetail?._id,
      countInStock: 10
    }));

    setShowQuantityControls(true);
  }, [selectedBrand, selectedQuantity, selectedQty, product, dispatch]);

  useEffect(() => {
    if (showQuantityControls) {
      addToCartHandler();
    }
  }, [showQuantityControls, addToCartHandler]);




  const handleMouseInteraction = (e, index, action, scrollType = 'brand') => {
    const scrollContainer = scrollType === 'brand'
      ? scrollContainersRef.current[index]
      : quantityScrollContainersRef.current[index]; // Handle different scroll types

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
     <>
      <div className="flex flex-wrap gap-4 justify-center">
  {product.details.map((detail, detailIndex) => (!selectedBrand || detail.brand === selectedBrand) && (
    <div key={detailIndex} className="border border-gray-300 rounded-lg p-2 shadow-md bg-white w-full h-full max-w-xs">
      {/* <Link to={`/product/${product.slug}`} state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}>
        <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          {detail.images?.map((image, imgIndex) => (
            <img
              key={imgIndex}
              src={image.image}
              ref={(el) => (productImageRefs.current[detailIndex] = el)}
              alt={product.name}
              // loading="lazy"
              decoding="async"
              width="320"
              height="240"
              className="w-full h-full object-cover"
            />
          ))}
          {getDiscount(selectedQuantity, detail.financials) > 0 && (
            <div className="absolute top-0 left-1 bg-teal-800 text-white text-[10px] px-1 py-1 font-semibold shadow-lg w-[25px] h-[35px] flex items-center justify-center clip-ribbon">
              {getDiscount(selectedQuantity, detail.financials)}% OFF
            </div>
          )}
        </div>
      </Link> */}
<Link
  to={`/product/${product.slug}`}
  state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}
>
  <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
    {detail.images?.map((image, imgIndex) => {
      // Prioritize only the first image of the first product card
      const isFirstVisibleImage = detailIndex === 0 && imgIndex === 0;

      return (
        <img
          key={imgIndex}
          src={image.image}
          ref={(el) => (productImageRefs.current[detailIndex] = el)}
          alt={product.name}
          loading={isFirstVisibleImage ? 'eager' : 'lazy'}
          fetchpriority={isFirstVisibleImage ? 'high' : 'auto'}
          decoding="async"
          width="320"
          height="240"
           className="block h-full w-full max-w-full object-contain rounded mx-auto"
        />
      );
    })}

    {getDiscount(selectedQuantity, detail.financials) > 0 && (
      <div className="absolute top-0 left-1 bg-teal-800 text-white text-[10px] px-1 py-1 font-semibold shadow-lg w-[25px] h-[35px] flex items-center justify-center clip-ribbon">
        {getDiscount(selectedQuantity, detail.financials)}% OFF
      </div>
    )}
  </div>
</Link>

      <div className="mt-2 text-center flex-1 flex flex-col justify-between">
        <p className="text-sm font-serif text-maroon-600 text-center line-clamp-3 min-h-[5.5rem] border border-gray-300 rounded-md px-2 py-1 shadow-sm">
          {product.name} - <span className="text-gray-700">{selectedQuantity}{detail.financials[0]?.units}</span>
        </p>

        {/* Quantity selector */}
        <div
          ref={(el) => (quantityScrollContainersRef.current[detailIndex] = el)}
          className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide"
          onMouseDown={(e) => handleMouseInteraction(e, detailIndex, 'down', 'quantity')}
          onMouseLeave={() => handleMouseInteraction(null, detailIndex, 'up', 'quantity')}
          onMouseUp={() => handleMouseInteraction(null, detailIndex, 'up', 'quantity')}
          onMouseMove={(e) => handleMouseInteraction(e, detailIndex, 'move', 'quantity')}
        >
          {detail.financials.map((f, idx) => (
            <button key={idx} onClick={() => handleQuantityChange(f.quantity.toString())}
              className={`px-2 py-0.5 rounded-md text-xs border ${selectedQuantity === f.quantity.toString()
                ? "bg-gray-100 text-black border-gray-500"
                : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"}`}
                aria-label={`Select price ₹${Math.round(f.dprice)}`}
                >
              ₹{Math.round(f.dprice)}
            </button>
          ))}
        </div>


        

        {/* Brand selector */}
        <div className="flex items-center">
          <div
            ref={(el) => (scrollContainersRef.current[detailIndex] = el)}
            className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide"
            onMouseDown={(e) => handleMouseInteraction(e, detailIndex, 'down', 'brand')}
            onMouseLeave={() => handleMouseInteraction(null, detailIndex, 'up', 'brand')}
            onMouseUp={() => handleMouseInteraction(null, detailIndex, 'up', 'brand')}
            onMouseMove={(e) => handleMouseInteraction(e, detailIndex, 'move', 'brand')}
          >
            {product.details.map((brandDetail) => (
              <button
                key={brandDetail.brand}
                ref={(el) => {
                  if (brandDetail.brand === selectedBrand) selectedButtonsRef.current[detailIndex] = el;
                }}
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
              {/* x Packs Total Price – always reserve space */}
        <div className="text-xs font-medium text-gray-700 mt-1 min-h-[0.1rem] text-center pr-2">
          {selectedQty > 1 ? (
            <>
              {selectedQty} x Packs{' '}
              <span className="text-green-700 font-semibold">
                ₹{(getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="opacity-0 select-none">0 x Packs ₹0.00</span> 
          )}
        </div>
        {/* Price + Add to Cart + Qty Controls */}
        <div className="flex justify-between items-center mt-2 px-2 min-h-[0.5rem]">
          <div className="text-sm text-gray-900 font-semibold">
            {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 ? (
              <>
                <span className="line-through text-xs text-gray-400">₹{getPrice(selectedQuantity, detail.financials).toFixed(2)}</span><br />
                <span className="bg-gray-200 text-black px-1 py-0.5 rounded-md font-semibold text-sm">₹{getDprice(selectedQuantity, detail.financials).toFixed(2)}</span>
              </>
            ) : (
              <span className="font-semibold text-sm">₹{getPrice(selectedQuantity, detail.financials).toFixed(2)}</span>
            )}
          </div>

          {showQuantityControls ? (
            <div className="flex items-center space-x-2 bg-green-700 px-2 py-1 rounded-lg text-white">
              <button onClick={() => handleQtyChange(selectedQty - 1)}>-</button>
              <span>{selectedQty}</span>
              <button onClick={() => handleQtyChange(selectedQty + 1)}>+</button>
            </div>
          ) : (
            <button onClick={() => addToCartHandler(detailIndex)} className="bg-gray-100 p-2 rounded-lg">
              <FaCartPlus className="text-green-800 w-6 h-6" />
            </button>
          )}
        </div>

      

      </div>
    </div>
  ))}
</div>

      <FloatingCartIcon ref={floatingCartIconRef} />
    </>
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
