import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailureScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">
        Unfortunately, your payment was not successful. Please try again or contact support if the issue persists.
      </p>
      <Link to="/cart">
        <button className="px-6 py-3 bg-green-600 text-white text-lg font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          Go Back to Cart
        </button>
      </Link>
    </div>
  );
};

export default PaymentFailureScreen;
