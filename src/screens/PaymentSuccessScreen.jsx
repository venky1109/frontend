import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateOrderMutation, usePayOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PaymentSuccessScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading: isCreatingOrder, error: createError }] = useCreateOrderMutation();
  const [payOrder, { isLoading: isPayingOrder, error: payError }] = usePayOrderMutation();

  const orderId = searchParams.get('orderId');

  // Use a ref to ensure `placeOrderHandler` is called only once
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const placeOrderHandler = async () => {
      try {
        // Prevent multiple order creation attempts
        if (hasPlacedOrder.current) return;

        // Mark as processed
        hasPlacedOrder.current = true;

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
        // console.log('Cart Items:', orderItems);
        // console.log('Shipping Address:', shippingAddress);
        // console.log('Items Price:', itemsPrice);
        // console.log('Shipping Price:', shippingPrice);
        // console.log('Total Price:', totalPrice);
        // console.log('Order ID:', orderId);

        // Step 1: Create the order
        const createdOrder = await createOrder({
          orderItems,
          shippingAddress,
          paymentMethod: 'Online',
          itemsPrice,
          shippingPrice,
          totalPrice,
          orderId, // Pass the Juspay orderId
        }).unwrap();

        // // Step 2: Update the order's payment status
        // const paymentDetails = {
        //   id: orderId, // Juspay order ID
        //   status: 'CHARGED', // Example status from Juspay
        //   update_time: new Date().toISOString(),
        // };

        // await payOrder({ orderId: createdOrder._id, details: paymentDetails }).unwrap();
        await payOrder({
          orderId: createdOrder._id, // Backend Order ID
          details: {
            id: orderId, // Juspay Order ID
            status: 'CHARGED', // Status from Juspay
            update_time: new Date().toISOString(), // Current timestamp
          },
        }).unwrap();
        
        // Clear cart items and navigate to the order page
        dispatch(clearCartItems());
        navigate(`/order/${createdOrder._id}`);
      } catch (err) {
        console.error('Error placing order:', err);
        toast.error('Failed to process your order. Please try again.');
        hasPlacedOrder.current = false; // Reset on error
        navigate('/cart');
      }
    };

    if (orderId) {
      placeOrderHandler();
    } else {
      toast.error('Payment was not successful.');
      navigate('/payment');
    }
  }, [orderId, createOrder, payOrder, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isCreatingOrder || isPayingOrder ? (
        <p>Processing your order...</p>
      ) : (
        <p>Your payment was successful. Preparing your order...</p>
      )}
      {(createError || payError) && (
        <p className="text-red-500">
          An error occurred: {createError?.message || payError?.message || 'Unknown error'}
        </p>
      )}
    </div>
  );
};

export default PaymentSuccessScreen;
