import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FloatingCartIcon = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [isFooterVisible, setFooterVisible] = useState(false);

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
    <div className={`fixed right-5 bottom-10 z-50 lg:block ${isFooterVisible ? 'hidden' : 'block'}`}>
      <Link to="/cart" className="relative">
        <div className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600">
          <FaShoppingBag className="text-2xl" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 inline-block w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default FloatingCartIcon;
