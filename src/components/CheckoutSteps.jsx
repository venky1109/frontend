import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex flex-wrap justify-center mb-8 mt-20">
      <div className="mx-1 md:mx-2">
        {step1 ? (
          <Link
            to="/login"
            className="text-green-800 bg-green-100 hover:bg-green-500 hover:text-white px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base"
          >
            Sign In
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base">
            Sign In
          </span>
        )}
      </div>

      <div className="mx-1 md:mx-2">
        {step2 ? (
          <Link
            to="/shipping"
            className="text-green-800 bg-green-100 hover:bg-green-500 hover:text-white px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base"
          >
            Shipping
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base">
            Shipping
          </span>
        )}
      </div>

      <div className="mx-1 md:mx-2">
        {step3 ? (
          <Link
            to="/payment"
            className="text-green-800 bg-green-100 hover:bg-green-500 hover:text-white px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base"
          >
            Payment
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base">
            Payment
          </span>
        )}
      </div>

      <div className="mx-1 md:mx-2">
        {step4 ? (
          <Link
            to="/placeorder"
            className="text-green-800 bg-green-100 hover:bg-green-500 hover:text-white px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base"
          >
            Place Order
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-2 py-1 md:px-3 md:py-2 rounded text-sm md:text-base">
            Place Order
          </span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
