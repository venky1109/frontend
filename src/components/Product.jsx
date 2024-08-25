import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import Cart from './Cart';

const Product = ({ product, keyword }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const dispatch = useDispatch();
  const scrollContainersRef = useRef([]);

  const calculateMaxDiscount = useCallback(
    (brand) => {
      const brandDetails = product.details.filter((detail) => detail.brand === brand);
      const maxDiscount = brandDetails.reduce((max, detail) => {
        const detailMaxDiscount = detail.financials.reduce(
          (max, financial) => Math.max(max, parseFloat(financial.Discount)),
          0
        );
        return Math.max(max, detailMaxDiscount);
      }, 0);
      return maxDiscount;
    },
    [product.details]
  );

  const maxDiscountQuanty = useCallback(
    (brand) => {
      const brandDetails = product.details.filter((detail) => detail.brand === brand);
      const maxDiscountqty = brandDetails.reduce((max, detail) => {
        const detailMaxDiscount = detail.financials.reduce(
          (max, financial) => Math.max(max, parseFloat(financial.quantity)),
          0
        );
        return Math.max(max, detailMaxDiscount);
      }, 0);
      return maxDiscountqty;
    },
    [product.details]
  );

  const getBrandWithHighestDiscount = useCallback(() => {
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
      const searchSelectedBrand = product.details.filter((detail) =>
        detail.brand.toLowerCase().includes(keyword.toLowerCase())
      );

      if (searchSelectedBrand.length > 0) {
        const brand = searchSelectedBrand[0].brand;
        const qty = maxDiscountQuanty(brand);
        newSelectedBrand = brand;
        newSelectedQuantity = qty.toString();
      } else {
        newSelectedBrand = getBrandWithHighestDiscount();
        const qty = maxDiscountQuanty(newSelectedBrand);
        newSelectedQuantity = qty.toString();
      }
    } else {
      newSelectedBrand = getBrandWithHighestDiscount();
      const qty = maxDiscountQuanty(newSelectedBrand);
      newSelectedQuantity = qty.toString();
    }

    setSelectedBrand(newSelectedBrand);
    setSelectedQuantity(newSelectedQuantity);
  }, [keyword, product.details, getBrandWithHighestDiscount, maxDiscountQuanty]);

  const handleBrandChange = (event) => {
    const newBrand = event.target.value;
    setSelectedBrand(newBrand);

    const qty = maxDiscountQuanty(newBrand);
    setSelectedQuantity(qty.toString());

    setIsAddedToCart(false);
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

  const handleScroll = (scrollDirection, index) => {
    const scrollContainer = scrollContainersRef.current[index];
    if (scrollContainer) {
      const containerWidth = scrollContainer.clientWidth;
      const scrollPosition = scrollContainer.scrollLeft;

      if (scrollDirection === 'left') {
        scrollContainer.scrollTo({
          left: Math.max(0, scrollPosition - containerWidth),
          behavior: 'smooth',
        });
      } else if (scrollDirection === 'right') {
        scrollContainer.scrollTo({
          left: scrollPosition + containerWidth,
          behavior: 'smooth',
        });
      }
    }
  };

  const getFormattedQuantity = (quantity) => {
    if (!isNaN(quantity)) {
      if (quantity > 30) {
        return `${quantity} grams`;
      } else {
        return `${quantity} Kg`;
      }
    }
    return 'N/A';
  };

  const getPrice = (selectedQuantity, financials) => {
    if (!financials || !Array.isArray(financials) || selectedQuantity == null) {
      return 'N/A';
    }

    const selectedFinancial = financials.find((financial) =>
      financial?.quantity?.toString() === selectedQuantity.toString()
    );
    const price = selectedFinancial ? selectedFinancial.price : null;
    return typeof price === 'number' ? price : 'N/A';
  };

  const getDprice = (selectedQuantity, financials) => {
    if (!financials || !Array.isArray(financials) || selectedQuantity == null) {
      return 0;
    }

    const selectedFinancial = financials.find((financial) =>
      financial?.quantity?.toString() === selectedQuantity.toString()
    );

    return selectedFinancial ? selectedFinancial.dprice : 0;
  };

  const getDiscount = (selectedQuantity, financials) => {
    if (!financials || !Array.isArray(financials) || selectedQuantity == null) {
      return 0;
    }

    const selectedFinancial = financials.find((financial) =>
      financial?.quantity?.toString() === selectedQuantity.toString()
    );

    return selectedFinancial ? selectedFinancial.Discount : 0;
  };

  const addToCartHandler = () => {
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 5000);
    const selectedDetail = product.details.find((detail) => detail.brand === selectedBrand);
    const selectedFinancial = selectedDetail.financials.find(
      (financial) => financial.quantity.toString() === selectedQuantity
    );

    dispatch(addToCart({
      name: product.name,
      productId: product._id,
      category: product.category,
      brand: selectedBrand,
      quantity: selectedQuantity,
      price: selectedFinancial.price,
      dprice: selectedFinancial.dprice,
      Discount: selectedFinancial.Discount,
      image: selectedDetail.images[0].image,
      qty: selectedQty,
      financialId: selectedFinancial._id,
      brandId: selectedDetail._id,
      countInStock: 10
    }));

    showCartScreen();
  };

  const showCartScreen = () => {
    const cartScreen = document.querySelector('.cart-screen');
    if (cartScreen) {
      cartScreen.classList.add('show');
    }
  };

  const hideCartScreen = () => {
    const cartScreen = document.querySelector('.cart-screen');
    if (cartScreen) {
      cartScreen.classList.remove('show');
    }
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {product.details.map((detail, detailIndex) => (
        (!selectedBrand || detail.brand === selectedBrand) && (
          <div key={detailIndex} className="bg-white shadow-md rounded-lg overflow-hidden mb-6 transform transition-transform hover:scale-105">
            <Link to={`/product/${product._id}`} state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}>
              <div className="relative h-48 w-full overflow-hidden" ref={(el) => (scrollContainersRef.current[detailIndex] = el)}>
                <div className="flex transition-all duration-500 ease-in-out">
                  {detail.images && detail.images.map((image, imageIndex) => (
                    <img key={imageIndex} src={image.image} className="object-cover w-full h-full" alt={`${product.name}`} />
                  ))}
                </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              </div>

              <div className="flex items-center mb-2">
                <label className="mr-4 font-semibold text-gray-600" htmlFor={`brandDropdown-${detailIndex}`}>Brand</label>
                <select id={`brandDropdown-${detailIndex}`} onChange={handleBrandChange} value={selectedBrand} className="block w-full p-2 border border-gray-300 rounded">
                  {product.details.map((detail) => (
                    <option key={detail.brand} value={detail.brand}>
                      {detail.brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mb-4">
                <label className="mr-4 font-semibold text-gray-600" htmlFor={`weightDropdown-${detailIndex}`}>Weight</label>
                <select id={`weightDropdown-${detailIndex}`} onChange={handleQuantityChange} value={selectedQuantity} className="block w-full p-2 border border-gray-300 rounded">
                  {detail.financials.map((financial, index) => (
                    <option key={index} value={financial.quantity}>
                      {getFormattedQuantity(financial.quantity)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded px-2 py-1">
                  {getDiscount(selectedQuantity, detail.financials)}% off
                </div>
              )}

              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button className="px-2 py-1" onClick={() => handleQtyChange(selectedQty - 1)}>-</button>
                  <span className="px-2">{selectedQty}</span>
                  <button className="px-2 py-1" onClick={() => handleQtyChange(selectedQty + 1)}>+</button>
                </div>

                <button
                  className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                  onClick={addToCartHandler}
                >
                  {isAddedToCart ? 'ITEM ADDED' : 'ADD TO CART'}
                  {isAddedToCart && <FaShoppingBag className="ml-2" />}
                </button>
              </div>

              {isAddedToCart && (
                <div className="cart-screen absolute top-0 left-0 right-0 bottom-0 bg-white flex flex-col items-center justify-center">
                  <button onClick={hideCartScreen} className="bg-green-700 text-white py-2 px-4 rounded mb-4">Close</button>
                  <Cart />
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <button className="text-gray-500 hover:text-gray-700" onClick={() => handleScroll('left', detailIndex)}>&lt;</button>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => handleScroll('right', detailIndex)}>&gt;</button>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Product;
