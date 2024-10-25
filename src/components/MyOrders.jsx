import React from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
// import { toggleAccountFormExternally } from './Header'; // Import toggle function
import { toggleAccountFormExternally as toggleHeaderForm } from './Header'; // Import from Header
import { toggleAccountFormExternally as toggleFooterForm } from './Footer'; // Import from Footer


const MyOrders = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();


  const handleDetailsClick = () => {
    if (window.innerWidth >= 768) { // Check if large screen
      toggleHeaderForm && toggleHeaderForm(); // Call Header toggle function for large screens
    } else {
      toggleFooterForm && toggleFooterForm(); // Call Footer toggle function for small screens
    }
  };

  return (
    
      <div className="p-1 bg-white shadow-md rounded-lg max-w-4xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-1 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-1 py-4 text-left whitespace-nowrap text-sm text-gray-900">
                      {order.totalPrice}
                    </td>
                    <td className="px-1 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-green-600 hover:text-green-900"
                        onClick={handleDetailsClick} // Hide screen on click
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    
  );
};

export default MyOrders;
