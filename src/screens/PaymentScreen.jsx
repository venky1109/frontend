import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { handleOnlinePayment } from '../slices/paymentApiSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems, totalPrice, itemsPrice, shippingPrice } = cart;

  const userInfo = useSelector((state) => state.auth.userInfo); // Access userInfo from auth slice

  const paymentState = useSelector((state) => state.payment);
  const { loading, paymentResponse, error } = paymentState || {};

  useEffect(() => {
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      navigate('/shipping');
    }

    // Save cart details to localStorage when the component is mounted
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    localStorage.setItem('itemsPrice', itemsPrice);
    localStorage.setItem('shippingPrice', shippingPrice);
    localStorage.setItem('totalPrice', totalPrice);
  }, [navigate, shippingAddress, cartItems, itemsPrice, shippingPrice, totalPrice]);
  

  useEffect(() => {
    if (paymentResponse?.data?.status === 'NEW' && paymentResponse?.data?.payment_links?.web) {
      // Redirect to HDFC bank payment URL
      window.location.href = paymentResponse.data.payment_links.web;
    }
  }, [paymentResponse]);

  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    dispatch(savePaymentMethod(method));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userInfo?.phoneNo) {
      alert('Phone number is missing in your profile.');
      return;
    }

    if (paymentMethod === 'Cash/UPI') {
      navigate('/placeorder');
    } else if (paymentMethod === 'Online') {
      dispatch(
        handleOnlinePayment({
          order_id: `order_${Date.now()}_${userInfo.phoneNo}`, // Use phone number from userInfo
          amount: totalPrice, // Use totalPrice from cart
          customerId: userInfo.phoneNo, // Use phoneNo from userInfo
        })
      );
    } else {
      alert('Please select a payment method.');
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-2xl font-semibold mb-6">Select Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col gap-4">
          {/* Cash/UPI Button */}
          <button
            type="button"
            onClick={() => handlePaymentSelection('Cash/UPI')}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm ${
              paymentMethod === 'Cash/UPI' ? 'ring-2 ring-offset-2 ring-green-500' : ''
            } hover:bg-green-700 focus:outline-none`}
          >
            Cash/UPI Payment On Delivery
          </button>

          {/* Online Payment Button */}
          <button
            type="button"
            onClick={() => handlePaymentSelection('Online')}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm ${
              paymentMethod === 'Online' ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
            } hover:bg-indigo-700 focus:outline-none`}
          >
            Online Payment
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && <p className="text-blue-500 mt-4">Processing payment...</p>}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-4">
            {typeof error === 'string' ? error : error.message || 'An error occurred'}
          </p>
        )}

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-4"
          disabled={!paymentMethod || loading}
        >
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
