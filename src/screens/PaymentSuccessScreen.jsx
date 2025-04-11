import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAll } from '../slices/cartSlice';

const PaymentSuccessScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderId = searchParams.get('orderId');
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const placeOrderHandler = async () => {
      try {
        if (hasPlacedOrder.current) return;
        hasPlacedOrder.current = true;

        const orderItems = JSON.parse(localStorage.getItem('cartItems'));
        const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
        const itemsPrice = localStorage.getItem('itemsPrice');
        const shippingPrice = localStorage.getItem('shippingPrice');
        const totalPrice = localStorage.getItem('totalPrice');

        if (!orderItems || !shippingAddress || !itemsPrice || !shippingPrice || !totalPrice) {
          toast.error('Incomplete order details. Please try again.');
          navigate('/cart');
          return;
        }

        // Order assumed created and paid on backend side
        dispatch(clearAll());
        navigate(`/order/${orderId}`);
      } catch (err) {
        console.error('Error navigating to order page:', err);
        toast.error('Failed to process your order. Please try again.');
        hasPlacedOrder.current = false;
        navigate('/cart');
      }
    };

    if (orderId) {
      placeOrderHandler();
    } else {
      toast.error('Payment was not successful.');
      navigate('/payment');
    }
  }, [orderId, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Your payment was successful. Preparing your order...</p>
    </div>
  );
};

export default PaymentSuccessScreen;
