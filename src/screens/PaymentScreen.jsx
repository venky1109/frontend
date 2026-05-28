import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { handleOnlinePayment } from '../slices/paymentApiSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import PaymentConfirmModal from '../components/PaymentConfirmModal';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems, totalPrice, itemsPrice, shippingPrice } = cart;
  // const [createOrder, { isLoading: isCreatingOrder, error: createError }] = useCreateOrderMutation();
  const [createOrder] = useCreateOrderMutation();
  const userInfo = useSelector((state) => state.auth.userInfo); // Access userInfo from auth slice
  // const [enableOnlinePayment, setEnableOnlinePayment] = useState(process.env.REACT_APP_ENABLE_ONLINE_PAYMENT === 'Y');
  const [enableOnlinePayment] = useState(process.env.REACT_APP_ENABLE_ONLINE_PAYMENT === 'Y');
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
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState('');

  const continueWithPayment = (method) => {
    setPaymentMethod(method);
    dispatch(savePaymentMethod(method));

    if (!userInfo?.phoneNo) {
      toast.error('Phone number is missing in your profile.');
      return;
    }

    setPendingPaymentMethod(method);
  };

  const cancelPaymentConfirmation = () => {
    setPendingPaymentMethod('');
  };

  const confirmPaymentSelection = () => {
    if (pendingPaymentMethod === 'Cash/UPI') {
      navigate('/placeorder');
    } else if (pendingPaymentMethod === 'Online') {
      createAndInitiatePayment();
    } else {
      toast.error('Please select a payment method.');
    }
  };
  const createAndInitiatePayment = async () => {
    try {
      // Step 1: Create the order
      const createdOrder = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: 'Online',
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      // Step 2: Initiate the payment
      dispatch(
        handleOnlinePayment({
          order_id: createdOrder._id, // Backend-created order ID
          amount: cart.totalPrice, // Total amount
          customerId: userInfo.phoneNo, // Customer phone number
          cartItems: cart.cartItems, // Cart items for validation
        })
      );
    } catch (error) {
      console.error('Error creating order or initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="pb-24">
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Payment</p>
        <h1 className="text-2xl font-extrabold text-slate-950">Select Payment Method</h1>
        <p className="mt-1 text-sm text-slate-500">Tap your preferred option and confirm to continue.</p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => continueWithPayment('Cash/UPI')}
            disabled={loading}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left shadow-sm transition ${
              paymentMethod === 'Cash/UPI'
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-200'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <span className="flex items-center gap-3">
              <FaMoneyBillWave />
              <span className="font-bold">Cash/UPI Payment On Delivery</span>
            </span>
            {paymentMethod === 'Cash/UPI' && <FaCheckCircle />}
          </button>

          {enableOnlinePayment && ( <button
            type="button"
            onClick={() => continueWithPayment('Online')}
            disabled={loading}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left shadow-sm transition ${
              paymentMethod === 'Online'
                ? 'bg-indigo-700 text-white ring-2 ring-indigo-200'
                : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            <span className="flex items-center gap-3">
              <FaUniversity />
              <span className="font-bold">Online Payment</span>
            </span>
            {paymentMethod === 'Online' && <FaCheckCircle />}
          </button>)}
        </div>

        {loading && <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">Processing payment...</p>}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
            {typeof error === 'string' ? error : error.message || 'An error occurred'}
          </p>
        )}
      </div>
      <PaymentConfirmModal
        method={pendingPaymentMethod}
        loading={loading}
        onCancel={cancelPaymentConfirmation}
        onConfirm={confirmPaymentSelection}
      />
    </FormContainer>
    </div>
  );
};

export default PaymentScreen;
