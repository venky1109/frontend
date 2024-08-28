import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
// import { useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import PrintableOrderDetails from '../components/PrintableOrderDetails';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  // const { userInfo } = useSelector((state) => state.auth);
  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  // const printableContentRef = useRef(null);

  // const printOrderDetails = () => {
  //   const content = printableContentRef.current.innerHTML;
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>ManaKirana</title>
  //       </head>
  //       <body>${content}</body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  // const deliverHandler = async () => {
  //   await deliverOrder(orderId);
  //   refetch();
  // };

  const handleContinueShopping = () => {
    navigate('/'); // Navigate to home page
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1 className="text-2xl font-semibold  mt-20">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">Shipping</h2>
            <p><strong>Name: </strong>{order.user.name}</p>
            <p><strong>Phone Number: </strong><a href={`call to:${order.user.phoneNo}`}>{order.user.phoneNo}</a></p>
            <p><strong>Address: </strong>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
            {order.isDelivered ? (
              <Message variant='success'>Delivered on {order.deliveredAt}</Message>
            ) : (
              <Message variant='info'><b>Order Successfully Placed and Delivery In Progress</b></Message>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p><strong>Method: </strong>{order.paymentMethod}</p>
            {order.isPaid ? (
              <Message variant='success'>Paid on {order.paidAt}</Message>
            ) : (
              <Message variant='info'><b>Please Pay Amount of <span className="text-brown-600">&#x20b9;{order.totalPrice}</span> at Delivery time</b></Message>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-2">Image</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-3">Brand</div>
                  <div className="col-span-2">Wt</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2"> Total</div>
                </div>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="text-sm grid grid-cols-12 gap-4 items-center mb-4">
                  {/* Image */}
                  <div className="col-span-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                
                  {/* Name */}
                  <div className="col-span-2 overflow-hidden whitespace-nowrap ">
                    {item.name}
                  </div>
                
                  {/* Brand */}
                  <div className="col-span-3 overflow-hidden whitespace-nowrap ">
                    {item.brand}
                  </div>
                
                  {/* Quantity */}
                  <div className="col-span-2 overflow-hidden whitespace-nowrap">
                    {item.quantity}
                    {item.units}
                  </div>
                
                  {/* Quantity in Cart */}
                  <div className="col-span-1">{item.qty}</div>
                
                  {/* Total Price */}
                  <div className="col-span-2">
                    &#x20b9;{(item.price * item.qty)}
                  </div>
                </div>
                
                  
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items Price</span>
              <span>&#x20b9;{order.itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>&#x20b9;{order.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>&#x20b9;{order.totalPrice}</span>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={handleContinueShopping}
            className="bg-green-800 text-white py-2 px-4 rounded mt-4 w-full hover:bg-green-600"
          >
            Continue Shopping
          </button>

          {/* {loadingDeliver && <Loader />}

          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )} */}
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
