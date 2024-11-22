import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PaymentSuccessScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const orderId = searchParams.get('orderId');

  // Use a ref to ensure placeOrderHandler is called only once
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const placeOrderHandler = async () => {
      try {
        // Fetch cart details from localStorage
        const orderItems = JSON.parse(localStorage.getItem('cartItems'));
        const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
        const itemsPrice = localStorage.getItem('itemsPrice');
        const shippingPrice = localStorage.getItem('shippingPrice');
        const totalPrice = localStorage.getItem('totalPrice');

        // Validate retrieved data
        if (!orderItems || !shippingAddress || !itemsPrice || !shippingPrice || !totalPrice) {
          toast.error('Incomplete order details. Please try again.');
          navigate('/cart');
          return;
        }

        // Log data for debugging
        console.log('Cart Items:', orderItems);
        console.log('Shipping Address:', shippingAddress);
        console.log('Items Price:', itemsPrice);
        console.log('Shipping Price:', shippingPrice);
        console.log('Total Price:', totalPrice);

        // Prevent multiple order creations
        if (hasPlacedOrder.current) return;

        // Mark as processed
        hasPlacedOrder.current = true;

        // Create order
        const res = await createOrder({
          orderItems,
          shippingAddress,
          paymentMethod: 'Online',
          itemsPrice,
          shippingPrice,
          totalPrice,
        }).unwrap();

        dispatch(clearCartItems());
        navigate(`/order/${res._id}`);
      } catch (err) {
        toast.error('Failed to place the order.');
        hasPlacedOrder.current = false; // Reset on error
      }
    };

    if (orderId) {
      placeOrderHandler();
    } else {
      toast.error('Payment was not successful.');
      navigate('/payment');
    }
  }, [orderId, createOrder, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isLoading ? (
        <p>Processing your order...</p>
      ) : (
        <p>Your payment was successful. Preparing your order...</p>
      )}
      {error && <p className="text-red-500">An error occurred: {error.message}</p>}
    </div>
  );
};

export default PaymentSuccessScreen;
