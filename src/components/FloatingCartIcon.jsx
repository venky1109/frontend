import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FloatingCartIcon = React.forwardRef((props, ref) => {
  const { cartItems } = useSelector((state) => state.cart);
  const [isFooterVisible, setFooterVisible] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.dprice * item.qty,
    0
  );

  useEffect(() => {
    const footer = document.querySelector('footer'); // Assuming your footer element is a <footer> tag

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust the threshold if needed
    );

    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  return (
    <div
      className={`fixed z-50 ${
        isFooterVisible ? 'bottom-24' : 'bottom-8'
      } right-4 lg:inset-y-1/2 lg:right-4 lg:bottom-auto transition-all duration-300 ease-in-out`}
    >
      <Link to="/cart" className="relative" ref={ref}>
        <div className="flex items-center justify-center w-10 h-9 bg-yellow-600 text-white rounded-md shadow-sm hover:bg-yellow-800 transition duration-300 ease-in-out lg:w-14 lg:h-16">
          <FaShoppingBag className="text-xl lg:text-2xl" />
          {cartItems.length > 0 && (
            <>
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full lg:w-5 lg:h-5">
                {cartItems.length}
              </span>
              <span className="absolute -bottom-5 bg-white text-green-600 text-xs font-semibold px-2 py-1 rounded-lg shadow-sm lg:text-sm">
                ₹{totalPrice}
              </span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
});

export default FloatingCartIcon;
