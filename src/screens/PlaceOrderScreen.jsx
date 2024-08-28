import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: 'Cash Or UPI',
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <p>
              <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <strong>Method:</strong> Cash/UPI On Delivery
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div>
                <div className="grid grid-cols-12 gap-4 font-semibold">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Brand</div>
                  <div className="col-span-2">Weight</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Price</div>
                </div>
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center border-b pb-4 mt-4">
                    <div className="col-span-1">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    </div>
                    <div className="col-span-3">{item.name}</div>
                    <div className="col-span-3">{item.brand}</div>
                    <div className="col-span-2">{item.quantity}</div>
                    <div className="col-span-1">{item.qty}</div>
                    <div className="col-span-2">&#x20b9;{(item.qty * item.dprice).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>&#x20b9;{cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>&#x20b9;{cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>&#x20b9;{cart.totalPrice}</span>
            </div>
            {error && (
              <Message variant="danger">{error.data.message}</Message>
            )}
          </div>
          <button
            type="button"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 mt-4"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
