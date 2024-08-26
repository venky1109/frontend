import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const Product = ({ product, keyword }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const isDown = useRef(false); // Fix: Initialize isDown with useRef
  const startX = useRef(0); // Fix: Initialize startX with useRef
  const scrollLeft = useRef(0); // Fix: Initialize scrollLeft with useRef

  const scrollContainersRef = useRef({});
  const selectedButtonsRef = useRef({});
  const dispatch = useDispatch();

  const calculateMaxDiscount = useCallback((brand) => {
    const brandDetails = product.details.filter((detail) => detail.brand === brand);
    return brandDetails.reduce((max, detail) => {
      return detail.financials.reduce(
        (max, financial) => Math.max(max, parseFloat(financial.Discount)),
        max
      );
    }, 0);
  }, [product.details]);

  const maxDiscountQuanty = useMemo(() => {
    return (brand) => {
      const brandDetails = product.details.filter((detail) => detail.brand === brand);
      return brandDetails.reduce((max, detail) => {
        return detail.financials.reduce(
          (max, financial) => Math.max(max, parseFloat(financial.quantity)),
          max
        );
      }, 0);
    };
  }, [product.details]);

  const getBrandWithHighestDiscount = useMemo(() => {
    let maxDiscount = 0;
    let brandWithMaxDiscount = '';

    product.details.forEach((detail) => {
      const brandMaxDiscount = calculateMaxDiscount(detail.brand);
      if (brandMaxDiscount > maxDiscount) {
        maxDiscount = brandMaxDiscount;
        brandWithMaxDiscount = detail.brand;
      }
    });

    return brandWithMaxDiscount;
  }, [product.details, calculateMaxDiscount]);

  useEffect(() => {
    let newSelectedBrand = '';
    let newSelectedQuantity = '';

    if (keyword) {
      const searchSelectedBrand = product.details.filter(detail =>
        detail.brand.toLowerCase().includes(keyword.toLowerCase())
      );

      if (searchSelectedBrand.length > 0) {
        const brand = searchSelectedBrand[0].brand;
        const qty = maxDiscountQuanty(brand);
        newSelectedBrand = brand;
        newSelectedQuantity = qty.toString();
      } else {
        newSelectedBrand = getBrandWithHighestDiscount;
        const qty = maxDiscountQuanty(newSelectedBrand);
        newSelectedQuantity = qty.toString();
      }
    } else {
      newSelectedBrand = getBrandWithHighestDiscount;
      const qty = maxDiscountQuanty(newSelectedBrand);
      newSelectedQuantity = qty.toString();
    }

    setSelectedBrand(newSelectedBrand);
    setSelectedQuantity(newSelectedQuantity);
  }, [keyword, product.details, getBrandWithHighestDiscount, maxDiscountQuanty]);

  const scrollToSelectedButton = (detailIndex) => {
    const button = selectedButtonsRef.current[detailIndex];
    const scrollContainer = scrollContainersRef.current[detailIndex];

    if (button && scrollContainer) {
      const buttonOffsetLeft = button.getBoundingClientRect().left;
      const containerOffsetLeft = scrollContainer.getBoundingClientRect().left;
      const containerScrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.clientWidth;
      const buttonWidth = button.clientWidth;

      const buttonRelativePosition = buttonOffsetLeft - containerOffsetLeft;

      const isButtonFullyVisible =
        buttonRelativePosition >= 0 &&
        buttonRelativePosition + buttonWidth <= containerWidth;

      if (!isButtonFullyVisible) {
        const scrollPosition = containerScrollLeft + buttonRelativePosition;

        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    Object.keys(selectedButtonsRef.current).forEach(detailIndex => {
      scrollToSelectedButton(detailIndex);
    });
  }, [selectedBrand]);

  const handleBrandChange = (detailIndex, brand) => {
    setSelectedBrand(brand);
    const qty = maxDiscountQuanty(brand);
    setSelectedQuantity(qty.toString());
    setIsAddedToCart(false);
    scrollToSelectedButton(detailIndex);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
    setIsAddedToCart(false);
  };

  const handleQtyChange = (newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQty(newQty);
      setIsAddedToCart(false);
    }
  };

  const addToCartHandler = () => {
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 5000);

    const selectedDetail = product.details.find((detail) => detail.brand === selectedBrand) || {};
    const selectedFinancial = selectedDetail.financials?.find(
      (financial) => financial.quantity.toString() === selectedQuantity.toString()
    ) || {};

    dispatch(addToCart({
      name: product.name,
      productId: product._id,
      category: product.category,
      brand: selectedBrand,
      quantity: selectedQuantity,
      price: selectedFinancial.price,
      dprice: selectedFinancial.dprice,
      Discount: selectedFinancial.Discount,
      image: selectedDetail.images ? selectedDetail.images[0].image : '',
      qty: selectedQty,
      financialId: selectedFinancial._id,
      brandId: selectedDetail._id,
      countInStock: 10
    }));
  };

  const handleMouseDown = (e, index) => {
    isDown.current = true;
    scrollContainersRef.current[index].classList.add('active');
    startX.current = e.pageX - scrollContainersRef.current[index].offsetLeft;
    scrollLeft.current = scrollContainersRef.current[index].scrollLeft;
  };

  const handleMouseLeave = (index) => {
    isDown.current = false;
    scrollContainersRef.current[index].classList.remove('active');
  };

  const handleMouseUp = (index) => {
    isDown.current = false;
    scrollContainersRef.current[index].classList.remove('active');
  };

  const handleMouseMove = (e, index) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainersRef.current[index].offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollContainersRef.current[index].scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {product.details.map((detail, detailIndex) => (
        (!selectedBrand || detail.brand === selectedBrand) && (
          <div
            key={detailIndex}
            className="border border-gray-300 rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out flex flex-col bg-white w-full h-full"
          >
            <Link to={`/product/${product._id}`} state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}>
              <div className="relative overflow-hidden rounded-t-lg h-48">
                {detail.images && detail.images.map((image, imageIndex) => (
                  <img key={imageIndex} src={image.image} className="w-20px h-30px object-cover transition-transform duration-250 ease-in-out transform hover:scale-110" alt={`${product.name}`} />
                ))}
                {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                  <div className="absolute top-2 left-2 bg-green-700 text-white px-2 py-1 rounded-lg">
                    <p>{getDiscount(selectedQuantity, detail.financials)}% off</p>
                  </div>
                )}
              </div>
            </Link>

            <div className="mt-4 text-center flex-1 flex flex-col justify-between">
              <p className="text-lg font-semibold text-maroon-600">{product.name}</p>

              <div className="flex flex-col mt-1 space-y-1">
                {/* Brand Scroll */}
                <div className="flex items-center">
                  <div
                    id={`brandScroll-${detailIndex}`}
                    ref={el => scrollContainersRef.current[detailIndex] = el}
                    className="flex overflow-x-auto space-x-2 py-2 scrollbar-hide"
                    onMouseDown={(e) => handleMouseDown(e, detailIndex)}
                    onMouseLeave={() => handleMouseLeave(detailIndex)}
                    onMouseUp={() => handleMouseUp(detailIndex)}
                    onMouseMove={(e) => handleMouseMove(e, detailIndex)}
                  >
                    {product.details.map((brandDetail) => (
                      <button
                        key={brandDetail.brand}
                        ref={el => {
                          if (brandDetail.brand === selectedBrand) {
                            selectedButtonsRef.current[detailIndex] = el;
                          }
                        }}
                        onClick={() => handleBrandChange(detailIndex, brandDetail.brand)}
                        className={`px-3 py-1 rounded-lg border ${
                          selectedBrand === brandDetail.brand
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'
                        } whitespace-nowrap`}
                        aria-label={`Select brand ${brandDetail.brand}`}
                      >
                        {brandDetail.brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex overflow-x-auto space-x-1 py-2 scrollbar-hide hover:scrollbar-visible w-full">
                    {detail.financials.map((financial, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuantityChange({ target: { value: financial.quantity } })}
                        className={`px-1 py-1 rounded-lg border ${
                          selectedQuantity.toString() === financial.quantity.toString()
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'
                        }`}
                      >
                        {getFormattedQuantity(financial.quantity)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xl font-semibold text-gray-900">
                    {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 ? (
                      <>
                        <span className="line-through text-red-500">
                          &#x20b9;{getPrice(selectedQuantity, detail.financials).toFixed(2)}
                        </span>
                        <span className="ml-2 text-green-900">
                          &#x20b9;{getDprice(selectedQuantity, detail.financials).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span>&#x20b9;{getPrice(selectedQuantity, detail.financials).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Price for Multiple Packs */}
                {selectedQuantity && selectedQty > 1 && (
                  <div className="mt-2 text-lg font-medium text-gray-800">
                    Total for {selectedQty} packs: 
                    <span className="ml-2 text-green-600">
                      &#x20b9;{(getPrice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between mt-4 space-x-2">
              <div className="flex items-center space-x-2">
                <button 
                  className="text-white px-3 py-1 bg-green-600 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
                  onClick={() => handleQtyChange(selectedQty - 1)}
                  aria-label="Decrease Quantity"
                >
                  -
                </button>
                <span className="text-lg font-semibold text-gray-800">{selectedQty}</span>
                <button 
                  className="text-white px-3 py-1 bg-green-600 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
                  onClick={() => handleQtyChange(selectedQty + 1)}
                  aria-label="Increase Quantity"
                >
                  +
                </button>
              </div>
              
              <button 
                className={`flex-1 flex items-center justify-center bg-green-700 text-white py-2 rounded-lg ml-2 transition-transform transform hover:scale-105 active:scale-95 ${isAddedToCart ? 'bg-green-800' : 'bg-green-700'}`}
                onClick={addToCartHandler}
              >
                {isAddedToCart ? 'ITEM ADDED' : 'ADD TO CART'}
                {isAddedToCart && <FaShoppingBag className="ml-2" />}
              </button>
            </div>

          </div>
        )
      ))}
    </div>
  );
};

export default Product;

// Helper functions for price and discount calculations
const getPrice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity.toString()
  );
  return selectedFinancial ? selectedFinancial.price : 0;
};

const getDprice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity.toString()
  );
  return selectedFinancial ? selectedFinancial.dprice : 0;
};

const getDiscount = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity.toString()
  );
  return selectedFinancial ? selectedFinancial.Discount : 0;
};

const getFormattedQuantity = (quantity) => {
  if (!isNaN(quantity)) {
    return quantity > 30 ? `${quantity} grams` : `${quantity} Kg`;
  }
  return 'N/A';
};
