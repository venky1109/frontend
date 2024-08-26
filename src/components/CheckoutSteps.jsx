import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center mb-8 mt-20">
      <div className="mx-2">
        {step1 ? (
          <Link
            to="/login"
            className="text-green-800 bg-green-100 hover:bg-green-500 hover:text-white px-3 py-2 rounded"
          >
            Sign In
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-3 py-2 rounded">Sign In</span>
        )}
      </div>

      <div className="mx-2">
        {step2 ? (
          <Link
            to="/shipping"
            className="text-green-800 bg-green-100  hover:bg-green-500 hover:text-white px-3 py-2 rounded"
          >
            Shipping
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-3 py-2 rounded">Shipping</span>
        )}
      </div>

      <div className="mx-2">
        {step3 ? (
          <Link
            to="/payment"
            className="text-green-800 bg-green-100  hover:bg-green-500 hover:text-white px-3 py-2 rounded"
          >
            Payment
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-3 py-2 rounded">Payment</span>
        )}
      </div>

      <div className="mx-2">
        {step4 ? (
          <Link
            to="/placeorder"
            className="text-green-800 bg-green-100  hover:bg-green-500 hover:text-white px-3 py-2 rounded"
          >
            Place Order
          </Link>
        ) : (
          <span className="text-gray-500 bg-red-100 px-3 py-2 rounded">Place Order</span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
