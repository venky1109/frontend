import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaCartPlus } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
import FloatingCartIcon from './FloatingCartIcon';

const Product = ({ product, keyword, alwaysShowOptions = false, compactRibbon = false, desktopCompact = false, onProductOpen }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const productImageRefs = useRef([]); // Array of refs for each product
  const floatingCartIconRef = useRef(null);

  const scrollContainersRef = useRef({});
  const quantityScrollContainersRef = useRef({}); // Refs for quantity scroll containers
  const selectedButtonsRef = useRef({});
  const selectedQuantityButtonsRef = useRef({});
  const clickedOptionRefs = useRef({});
  const loopScrollTimeoutsRef = useRef({});
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



  const scrollToSelectedButton = useCallback((detailIndex, scrollType = 'brand', behavior = 'smooth', force = true) => {
    const button = scrollType === 'brand'
      ? selectedButtonsRef.current[detailIndex]
      : selectedQuantityButtonsRef.current[detailIndex];
    const scrollContainer = scrollType === 'brand'
      ? scrollContainersRef.current[detailIndex]
      : quantityScrollContainersRef.current[detailIndex];

    if (button && scrollContainer) {
      const buttonRect = button.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonLeft = buttonRect.left - containerRect.left;
      const buttonRight = buttonRect.right - containerRect.left;
      const edgePadding = Math.min(32, scrollContainer.clientWidth * 0.18);

      if (!force && buttonLeft >= edgePadding && buttonRight <= scrollContainer.clientWidth - edgePadding) {
        return;
      }

      const centeredLeft = scrollContainer.scrollLeft
        + buttonLeft
        - ((scrollContainer.clientWidth - buttonRect.width) / 2);
      scrollContainer.dataset.centering = 'true';

      scrollContainer.scrollTo({
        left: Math.max(centeredLeft, 0),
        behavior,
      });

      window.setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.dataset.centering = 'false';
        }
      }, behavior === 'smooth' ? 420 : 40);
    }
  }, []);

  useEffect(() => {
    Object.keys(selectedButtonsRef.current).forEach((detailIndex) => {
      scrollToSelectedButton(detailIndex, 'brand', 'smooth', alwaysShowOptions);
    });
  }, [alwaysShowOptions, selectedBrand, scrollToSelectedButton]);

  useEffect(() => {
    Object.keys(selectedQuantityButtonsRef.current).forEach((detailIndex) => {
      scrollToSelectedButton(detailIndex, 'quantity', 'smooth', alwaysShowOptions);
    });
  }, [alwaysShowOptions, selectedQuantity, scrollToSelectedButton]);

  useLayoutEffect(() => {
    if (!alwaysShowOptions) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      Object.keys(selectedButtonsRef.current).forEach((detailIndex) => {
        scrollToSelectedButton(detailIndex, 'brand', 'auto');
      });
      Object.keys(selectedQuantityButtonsRef.current).forEach((detailIndex) => {
        scrollToSelectedButton(detailIndex, 'quantity', 'auto');
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [alwaysShowOptions, selectedBrand, selectedQuantity, product.details, scrollToSelectedButton]);

  const scrollClickedOptionIntoPlace = (detailIndex, scrollType, fallbackValue) => {
    const clickedButton = clickedOptionRefs.current[`${scrollType}-${detailIndex}-${fallbackValue}`];
    const selectedStore = scrollType === 'brand' ? selectedButtonsRef : selectedQuantityButtonsRef;

    if (clickedButton) {
      selectedStore.current[detailIndex] = clickedButton;
    }

    scrollToSelectedButton(detailIndex, scrollType, 'smooth', false);
  };

  const handleBrandChange = (detailIndex, brand) => {
    setSelectedBrand(brand);
    setSelectedQuantity(maxDiscountQuantity(brand).toString());
    setSelectedQty(1);
    setShowQuantityControls(false);
    window.setTimeout(() => {
      scrollClickedOptionIntoPlace(detailIndex, 'brand', brand);
      scrollToSelectedButton(detailIndex, 'quantity', 'smooth', false);
    }, 0);
  };

  const handleQuantityChange = (detailIndex, quantity) => {
    setSelectedQuantity(quantity);
    setSelectedQty(1);
    setShowQuantityControls(false);
    window.setTimeout(() => scrollClickedOptionIntoPlace(detailIndex, 'quantity', quantity), 0);
  };

  const handleQtyChange = useCallback((newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQty(newQty);
    }
  }, []);
  const addToCartHandler = useCallback((index) => {
    if (isAdding) return;

    const selectedDetail = product.details.find((detail) => detail.brand === selectedBrand) || {};
    const selectedFinancial = selectedDetail.financials?.find(
      (financial) => financial.quantity.toString() === selectedQuantity.toString()
    );

    if (!selectedFinancial) return;

    setIsAdding(true);
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
      price: selectedFinancial.price,
      dprice: selectedFinancial.dprice,
      Discount: selectedFinancial.Discount,
      image: selectedDetail?.images ? selectedDetail.images[0].image : '',
      qty: selectedQty,
      financialId: selectedFinancial?._id,
      brandId: selectedDetail?._id,
      countInStock: 10
    }));

    window.setTimeout(() => {
      setShowQuantityControls(true);
      setIsAdding(false);
    }, 220);
  }, [isAdding, selectedBrand, selectedQuantity, selectedQty, product, dispatch]);




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

  const handleCircularScroll = (index, scrollType = 'brand') => {
    const scrollContainer = scrollType === 'brand'
      ? scrollContainersRef.current[index]
      : quantityScrollContainersRef.current[index];

    if (!scrollContainer || scrollContainer.dataset.loop !== 'true') return;
    if (scrollContainer.dataset.centering === 'true') return;

    const segmentWidth = scrollContainer.scrollWidth / 3;
    if (!segmentWidth) return;

    const key = `${scrollType}-${index}`;
    window.clearTimeout(loopScrollTimeoutsRef.current[key]);

    loopScrollTimeoutsRef.current[key] = window.setTimeout(() => {
      if (scrollContainer.scrollLeft < segmentWidth * 0.45) {
        scrollContainer.scrollLeft += segmentWidth;
      } else if (scrollContainer.scrollLeft > segmentWidth * 1.55) {
        scrollContainer.scrollLeft -= segmentWidth;
      }
    }, 220);
  };

  return (
     <>
      <div className="flex h-full w-full min-w-0 justify-center">
  {product.details.map((detail, detailIndex) => {
    if (selectedBrand && detail.brand !== selectedBrand) return null;

    const hasMultipleBrands = product.details.length > 1;
    const hasSingleQuantity = detail.financials.length === 1;
    const shouldShowQuantitySelector = alwaysShowOptions || !hasSingleQuantity;
    const shouldShowBrandSelector = hasMultipleBrands;
    const quantityOptions = detail.financials.map((financial) => ({ financial, loopIndex: 1 }));
    const brandOptions = product.details.map((brandDetail) => ({ brandDetail, loopIndex: 1 }));

    return (
    <div
      key={detailIndex}
      className={`flex h-full min-h-[11rem] w-full min-w-0 max-w-none flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-1.5 shadow-md transition ${
        desktopCompact
          ? 'md:min-h-[14.25rem] md:rounded-xl md:border-gray-200 md:p-2 md:shadow-[0_4px_14px_rgba(15,23,42,0.08)] md:hover:-translate-y-0.5 md:hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)]'
          : ''
      }`}
    >
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
  onClick={(event) => {
    if (onProductOpen) {
      event.preventDefault();
      onProductOpen(product, { brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty });
    }
  }}
>
  <div className={`relative aspect-[4/3] overflow-hidden rounded-md border border-gray-300 bg-gray-50 ${
    desktopCompact ? 'md:aspect-square md:border-gray-100 md:bg-slate-50 md:p-2' : ''
  }`}>
    {detail.images?.map((image, imgIndex) => {
      // Prioritize only the first image of the first product card
      const isFirstVisibleImage = detailIndex === 0 && imgIndex === 0;

      return (
        <img
          key={imgIndex}
          src={image.image}
          ref={(el) => (productImageRefs.current[detailIndex] = el)}
          alt={product.name}
          draggable="false"
          loading={isFirstVisibleImage ? 'eager' : 'lazy'}
          fetchpriority={isFirstVisibleImage ? 'high' : 'auto'}
          decoding="async"
          width="320"
          height="240"
           className="mx-auto block h-full w-full max-w-full rounded object-contain"
        />
      );
    })}

    <div className={`absolute left-1 top-1 flex flex-col items-center justify-center rounded-b-md rounded-t-sm px-0.5 text-center font-bold uppercase leading-none shadow-md ${
      compactRibbon ? 'min-h-7 w-7 py-0.5 text-[8px]' : 'min-h-8 w-8 py-1 text-[9px]'
    } ${
      getDiscount(selectedQuantity, detail.financials) > 0
        ? 'bg-emerald-700 text-white'
        : 'bg-transparent text-transparent shadow-none'
    }`}>
      {getDiscount(selectedQuantity, detail.financials) > 0 && (
        <>
          <span>{Number(getDiscount(selectedQuantity, detail.financials)).toFixed(0)}%</span>
          <span className={`mt-0.5 leading-none ${compactRibbon ? 'text-[7px]' : 'text-[8px]'}`}>Off</span>
        </>
      )}
    </div>
    {/* {getDiscount(selectedQuantity, detail.financials) > 0 && (
      <div className="absolute left-1 top-1 flex min-h-8 w-8 flex-col items-center justify-center rounded-b-md rounded-t-sm bg-emerald-700 px-0.5 py-1 text-center text-[9px] font-bold uppercase leading-none text-white shadow-md">
        <span>{Number(getDiscount(selectedQuantity, detail.financials)).toFixed(0)}%</span>
        <span className="mt-0.5 text-[8px] leading-none">Off</span>
      </div>
    )} */}
  </div>
</Link>

      <div className="mt-1.5 flex flex-1 flex-col text-center">
        <p
          className={`overflow-hidden rounded-md border border-gray-300 px-1 py-1 text-center font-sans text-[10px] font-semibold leading-[1.08] text-slate-950 shadow-sm sm:px-1.5 sm:text-[11px] md:text-xs ${
            desktopCompact
              ? 'h-[3.65rem] sm:h-[4rem] md:h-[2.75rem] md:border-transparent md:px-0 md:py-0.5 md:text-[11px] md:leading-[1.18] md:shadow-none'
              : 'h-[3.65rem] sm:h-[4rem]'
          }`}
          title={`${product.name} - ${selectedQuantity}${detail.financials[0]?.units || ''}`}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: desktopCompact ? 3 : 4,
          }}
        >
          {product.name} - <span className="text-gray-700">{selectedQuantity}{detail.financials[0]?.units}</span>
        </p>

        {!shouldShowQuantitySelector && !shouldShowBrandSelector ? (
          <div className="min-h-[0.25rem]" aria-hidden="true" />
        ) : (
          <>
        {/* Quantity selector */}
        {shouldShowQuantitySelector && (
        <div
          ref={(el) => (quantityScrollContainersRef.current[detailIndex] = el)}
          data-loop="false"
          className="flex w-full max-w-full overflow-x-auto overscroll-x-contain space-x-1 py-1 scrollbar-hide"
          onMouseDown={(e) => handleMouseInteraction(e, detailIndex, 'down', 'quantity')}
          onMouseLeave={() => handleMouseInteraction(null, detailIndex, 'up', 'quantity')}
          onMouseUp={() => handleMouseInteraction(null, detailIndex, 'up', 'quantity')}
          onMouseMove={(e) => handleMouseInteraction(e, detailIndex, 'move', 'quantity')}
          onScroll={() => handleCircularScroll(detailIndex, 'quantity')}
        >
          {quantityOptions.map(({ financial: f, loopIndex }, idx) => (
            <button
              key={`${loopIndex}-${f._id || f.quantity}-${idx}`}
              ref={(el) => {
                if (loopIndex === 1 && selectedQuantity === f.quantity.toString()) {
                  selectedQuantityButtonsRef.current[detailIndex] = el;
                }
                if (el) {
                  clickedOptionRefs.current[`quantity-${detailIndex}-${f.quantity}`] = el;
                }
              }}
              onClick={(event) => {
                clickedOptionRefs.current[`quantity-${detailIndex}-${f.quantity}`] = event.currentTarget;
                handleQuantityChange(detailIndex, f.quantity.toString());
              }}
              className={`flex-none px-1.5 py-0.5 rounded-md text-[11px] border ${selectedQuantity === f.quantity.toString()
                ? "bg-amber-200 text-slate-950 border-amber-500 shadow-sm"
                : "bg-amber-50 text-slate-800 border-amber-200 hover:border-amber-400 hover:bg-amber-100"}`}
                aria-label={`Select price ₹${Math.round(f.dprice)}`}
                >
              ₹{Math.round(f.dprice)}
            </button>
          ))}
        </div>
        )}


        

        {/* Brand selector */}
        {shouldShowBrandSelector && (
        <div className="flex min-w-0 max-w-full items-center">
          <div
            ref={(el) => (scrollContainersRef.current[detailIndex] = el)}
            data-loop="false"
            className="flex w-full max-w-full overflow-x-auto overscroll-x-contain space-x-1 py-0.5 scrollbar-hide"
            onMouseDown={(e) => handleMouseInteraction(e, detailIndex, 'down', 'brand')}
            onMouseLeave={() => handleMouseInteraction(null, detailIndex, 'up', 'brand')}
            onMouseUp={() => handleMouseInteraction(null, detailIndex, 'up', 'brand')}
            onMouseMove={(e) => handleMouseInteraction(e, detailIndex, 'move', 'brand')}
            onScroll={() => handleCircularScroll(detailIndex, 'brand')}
          >
            {brandOptions.map(({ brandDetail, loopIndex }, idx) => (
              <button
                key={`${loopIndex}-${brandDetail._id || brandDetail.brand}-${idx}`}
                ref={(el) => {
                  if (loopIndex === 1 && brandDetail.brand === selectedBrand) selectedButtonsRef.current[detailIndex] = el;
                  if (el) {
                    clickedOptionRefs.current[`brand-${detailIndex}-${brandDetail.brand}`] = el;
                  }
                }}
                onClick={(event) => {
                  clickedOptionRefs.current[`brand-${detailIndex}-${brandDetail.brand}`] = event.currentTarget;
                  handleBrandChange(detailIndex, brandDetail.brand);
                }}
                className={`flex-none px-1.5 py-0.5 rounded-lg border ${selectedBrand === brandDetail.brand
                  ? 'bg-gray-100 text-black border-gray-500'
                  : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'} whitespace-nowrap text-[11px]`}
                  aria-label={`Select brand ${brandDetail.brand}`}
              >
                {brandDetail.brand}
              </button>
            ))}
          </div>
        </div>
        )}
              {/* x Packs Total Price – always reserve space */}
          </>
        )}
        <div className={`text-center text-[11px] font-medium text-gray-700 sm:text-xs ${desktopCompact ? 'min-h-3 md:min-h-2' : 'min-h-4'}`}>
          {selectedQty > 1 ? (
            <>
              {selectedQty} x Packs{' '}
              <span className="text-green-700 font-semibold">
                ₹{formatProductPrice(getDprice(selectedQuantity, detail.financials) * selectedQty)}
              </span>
            </>
          ) : (
            null
          )}
        </div>
        {/* Price + Add to Cart + Qty Controls */}
        <div className={`mt-auto flex items-end justify-between gap-1.5 px-0.5 pr-1 pt-0.5 sm:gap-2 sm:px-1 sm:pt-1 ${
          desktopCompact ? 'min-h-[2rem] sm:min-h-[2.25rem] md:min-h-[1.85rem] md:px-0 md:pt-0' : 'min-h-[2rem] sm:min-h-[2.25rem]'
        }`}>
          <div className="min-w-[2.7rem] max-w-[calc(100%-2.75rem)] flex-1 overflow-hidden text-left font-semibold text-gray-900 sm:max-w-none sm:text-sm">
            {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 ? (
              <>
                <span className="block truncate text-[9px] leading-none text-gray-400 line-through sm:text-xs">₹{formatProductPrice(getPrice(selectedQuantity, detail.financials))}</span>
                <span className="inline-block min-w-[2.55rem] max-w-full whitespace-nowrap rounded-md border border-amber-300 bg-amber-100 px-0.5 py-0.5 text-center text-[10px] leading-none text-slate-950 sm:px-1 sm:text-sm">₹{formatProductPrice(getDprice(selectedQuantity, detail.financials))}</span>
              </>
            ) : (
              <span className="inline-block min-w-[2.55rem] max-w-full whitespace-nowrap rounded-md border border-amber-300 bg-amber-100 px-0.5 py-0.5 text-center text-[10px] leading-none text-slate-950 sm:px-1 sm:text-sm">₹{formatProductPrice(getPrice(selectedQuantity, detail.financials))}</span>
            )}
          </div>

          {showQuantityControls ? (
            <div className="flex h-5 w-9 flex-none items-center justify-between overflow-hidden rounded-md bg-green-700 text-[9px] font-semibold text-white shadow-sm sm:h-7 sm:w-auto sm:space-x-2 sm:rounded-lg sm:px-2 sm:py-0.5 sm:text-sm">
              <button
                type="button"
                onClick={() => handleQtyChange(selectedQty - 1)}
                disabled={selectedQty <= 1}
                className="flex h-5 w-2.5 items-center justify-center disabled:opacity-45 sm:h-7 sm:w-auto"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-3 text-center leading-none sm:w-auto">{selectedQty}</span>
              <button
                type="button"
                onClick={() => handleQtyChange(selectedQty + 1)}
                disabled={selectedQty >= 9}
                className="flex h-5 w-2.5 items-center justify-center disabled:opacity-45 sm:h-7 sm:w-auto"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCartHandler(detailIndex)}
              disabled={isAdding}
              className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-gray-100 text-green-800 shadow-sm transition hover:bg-green-50 disabled:cursor-wait disabled:bg-green-100 sm:h-auto sm:w-auto sm:rounded-lg sm:p-1.5"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <CgSpinner className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
              ) : (
                <FaCartPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          )}
        </div>

      

      </div>
    </div>
  )})}
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

const formatProductPrice = (value) => {
  const numericValue = Number(value) || 0;
  return Number.isInteger(numericValue) ? numericValue.toFixed(0) : numericValue.toFixed(2);
};
