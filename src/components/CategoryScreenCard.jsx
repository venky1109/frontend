
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const scrollContainersRef = useRef({});
  const dispatch = useDispatch();

  // Access the cart state from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const initialQuantities = {};
    const initialQtys = {};
    const initialShowControls = {};

    product.details.forEach((detail, index) => {
      const firstQuantity = detail.financials[0]?.quantity.toString();
      initialQuantities[index] = firstQuantity;
      initialQtys[index] = 1;

      // Check if the item is already in the cart for the given quantity
      const cartItem = cartItems.find(
        (item) =>
          item.productId === product._id &&
          item.brand === detail.brand &&
          item.quantity === firstQuantity
      );

      initialShowControls[index] = !!cartItem;
      if (cartItem) {
        initialQtys[index] = cartItem.qty; // Set the initial quantity from the cart
      }
    });

    setSelectedQuantities(initialQuantities);
    setSelectedQtys(initialQtys);
    setShowQuantityControls(initialShowControls);
  }, [product.details, product._id, cartItems]);

  const handleQuantityChange = (detailIndex, quantity) => {
    setSelectedQuantities((prevState) => ({
      ...prevState,
      [detailIndex]: quantity,
    }));

    const cartItem = cartItems.find(
      (item) =>
        item.productId === product._id &&
        item.brand === product.details[detailIndex].brand &&
        item.quantity === quantity
    );

    setSelectedQtys((prevState) => ({
      ...prevState,
      [detailIndex]: cartItem ? cartItem.qty : 1, // Set the quantity from cart if it exists
    }));

    setShowQuantityControls((prevState) => ({
      ...prevState,
      [detailIndex]: !!cartItem, // Show controls only if item is in the cart
    }));
  };

  const handleQtyChange = (detailIndex, newQty) => {
    if (newQty >= 1 && newQty <= 9) {
      setSelectedQtys((prevState) => ({
        ...prevState,
        [detailIndex]: newQty,
      }));
      const detail = product.details[detailIndex];
      const selectedQuantity = selectedQuantities[detailIndex];
      const selectedFinancial = detail.financials.find(
        (financial) => financial.quantity.toString() === selectedQuantity
      );
      dispatch(
        addToCart({
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
        })
      );
    }
  };

  const addToCartHandler = (detailIndex, detail) => {
    const selectedQuantity = selectedQuantities[detailIndex];
    const selectedFinancial = detail.financials.find(
      (financial) => financial.quantity.toString() === selectedQuantity
    );

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

    dispatch(
      addToCart({
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
      })
    );

    setShowQuantityControls((prevState) => ({
      ...prevState,
      [detailIndex]: true,
    }));
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
    <>
      {product.details.map((detail, detailIndex) => (
        <div
          key={`${product._id}-${detail.brand}`}
          className="border border-gray-300 rounded-lg p-2 shadow-md transition-transform duration-200 ease-in-out flex flex-col bg-white w-full h-full max-w-xs"
        >
          <Link
            to={`/product/${product._id}`}
            state={{
              brand: detail.brand,
              quantity: selectedQuantities[detailIndex],
              qty: selectedQtys[detailIndex],
            }}
          >
            <div className="relative overflow-hidden border border-gray-300 rounded-lg h-32">
              {detail.images?.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.image}
                  ref={(el) => (productImageRefs.current[detailIndex] = el)}
                  className="w-full h-full object-cover transition-transform duration-250 ease-in-out transform hover:scale-110"
                  alt={`${product.name}`}
                />
              ))}
              <span className="absolute top-2 left-2 bg-green-700 text-white px-1 py-0.5 rounded-lg text-xs">
                {getDiscount(
                  selectedQuantities[detailIndex],
                  detail.financials
                )}
                % off
              </span>
            </div>
          </Link>

          <div className="mt-2 text-center flex-1 flex flex-col justify-between">
          <p className="text-sm font-serif text-maroon-600">
  {(() => {
    const brandWords = detail.brand.toLowerCase().split(' ');
    const productWords = product.name.toLowerCase().split(' ');

    // Combine both brand and product words into a set to remove duplicates
    const combinedWords = [...new Set([...brandWords, ...productWords])];

    // Rebuild the final string (capitalize the first letter of each word)
    const finalString = combinedWords
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return finalString;
  })()}
</p>











            {/* Display Units and Quantity Options */}
            <div className="flex items-center">
              <div 
                ref={(el) => (scrollContainersRef.current[`units-${detailIndex}`] = el)}
                className="flex overflow-x-auto space-x-1 py-1 scrollbar-hide w-full"
                onMouseDown={(e) => handleMouseInteraction(e, `units-${detailIndex}`, 'down')}
                onMouseLeave={() => handleMouseInteraction(null, `units-${detailIndex}`, 'up')}
                onMouseUp={() => handleMouseInteraction(null, `units-${detailIndex}`, 'up')}
                onMouseMove={(e) => handleMouseInteraction(e, `units-${detailIndex}`, 'move')}
              >
                {detail.financials.map((financial, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleQuantityChange(
                        detailIndex,
                        financial.quantity.toString()
                      )
                    }
                    className={`px-2 py-0.5 rounded-lg border ${
                      selectedQuantities[detailIndex] ===
                      financial.quantity.toString()
                        ? 'bg-gray-100 text-black border-gray-500'
                        : 'bg-white text-maroon-600 border-maroon-600 hover:bg-maroon-100'
                    } text-xs`}
                  >
                    {financial.quantity}
                    {financial.units}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Information */}
            <div className="flex items-center justify-between mt-2 space-x-2">
              {/* Price and Multiple Qty Price Group */}
              <div className="flex flex-col ml-3">
                <div className="text-md text-gray-900">
                  {selectedQuantities[detailIndex] &&
                  getDiscount(
                    selectedQuantities[detailIndex],
                    detail.financials
                  ) > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">
                        &#x20b9;
                        {getPrice(
                          selectedQuantities[detailIndex],
                          detail.financials
                        ).toFixed(2)}
                      </span>
                      <span className="bg-gray-100 font-semibold text-black-700">
                        &#x20b9;
                        {getDprice(
                          selectedQuantities[detailIndex],
                          detail.financials
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>
                      &#x20b9;
                      {getPrice(
                        selectedQuantities[detailIndex],
                        detail.financials
                      ).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Price for Multiple Packs */}
                {selectedQtys[detailIndex] > 1 && (
                  <div className="text-xs font-small font-bold text-gray-800">
                    {selectedQtys[detailIndex]}x Packs{' '}
                    <span className="text-green-900">
                      &#x20b9;
                      {(
                        getDprice(
                          selectedQuantities[detailIndex],
                          detail.financials
                        ) * selectedQtys[detailIndex]
                      ).toFixed(2)}
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
                      onClick={() =>
                        handleQtyChange(detailIndex, selectedQtys[detailIndex] - 1)
                      }
                      aria-label="Decrease Quantity"
                    >
                      -
                    </button>
                    <span className="text-sm text-white font-semibold">
                      {selectedQtys[detailIndex]}
                    </span>
                    <button
                      className="text-white px-2 py-0.5"
                      onClick={() =>
                        handleQtyChange(detailIndex, selectedQtys[detailIndex] + 1)
                      }
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
