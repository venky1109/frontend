import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PrintableOrderDetails from '../components/PrintableOrderDetails';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const printableContentRef = useRef(null);

  const printOrderDetails = () => {
    const content = printableContentRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ManaKirana</title>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1 className="text-2xl font-semibold mb-4 mt-20">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">Shipping</h2>
            <p><strong>Name: </strong>{order.user.name}</p>
            <p><strong>Phone Number: </strong><a href={`call to:${order.user.phoneNo}`}>{order.user.phoneNo}</a></p>
            <p><strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
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
                <div className="grid grid-cols-12 gap-4 font-semibold mb-4">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Brand</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Total Price</div>
                </div>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">
                    <div className="col-span-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    <div className="col-span-3">{item.name}</div>
                    <div className="col-span-3">{item.brand}</div>
                    <div className="col-span-2">{item.quantity}</div>
                    <div className="col-span-1">{item.qty}</div>
                    <div className="col-span-2">&#x20b9;{item.price * item.qty}</div>
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
            {userInfo && userInfo.isAdmin && (
              <button
                onClick={printOrderDetails}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full hover:bg-blue-600"
              >
                Print Order Details
              </button>
            )}
            <div ref={printableContentRef} style={{ display: 'none' }}>
              <PrintableOrderDetails order={order} />
            </div>
          </div>

          {loadingDeliver && <Loader />}

          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
