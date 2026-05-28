import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { FaArrowLeft, FaCheckCircle, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';

import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    // Ensure that shippingAddress is defined and contains necessary fields
    if (
      !cart.shippingAddress ||
      !cart.shippingAddress.street ||  // Adjust these fields as per your state structure
      !cart.shippingAddress.city ||
      !cart.shippingAddress.postalCode
    ) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);  // Use `cart.shippingAddress` instead of `.address`
  

  const dispatch = useDispatch();
  const formatPrice = (value) => Number(value || 0).toFixed(2);
  const shippingLine = [
    cart.shippingAddress?.address || cart.shippingAddress?.street,
    cart.shippingAddress?.city,
    cart.shippingAddress?.postalCode,
    cart.shippingAddress?.country,
  ].filter(Boolean).join(', ');

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod || 'Cash/UPI',
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
    <div className="pb-24">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Review Order</p>
          <h1 className="text-xl font-semibold text-slate-950">Place Order</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/payment')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-100"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 md:hidden"
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            {isLoading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="space-y-4 md:col-span-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FaMapMarkerAlt />
              </span>
              <h2 className="text-lg font-semibold text-slate-950">Shipping</h2>
            </div>
            <p className="text-sm leading-6 text-slate-700">
              <span className="font-bold text-slate-950">Address:</span> {shippingLine || 'Address not available'}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FaCheckCircle />
              </span>
              <h2 className="text-lg font-semibold text-slate-950">Payment Method</h2>
            </div>
            <p className="text-sm text-slate-700">
              <span className="font-bold text-slate-950">Method:</span> {cart.paymentMethod === 'Online' ? 'Online Payment' : 'Cash/UPI On Delivery'}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <FaShoppingBag />
                </span>
                <h2 className="text-lg font-semibold text-slate-950">Order Items</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                {cart.cartItems.length} items
              </span>
            </div>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="space-y-3">
                {cart.cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.brand}-${item.quantity}-${index}`}
                    className="grid grid-cols-[3.75rem_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg border border-slate-100 bg-white object-contain p-1"
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-xs font-extrabold uppercase leading-4 text-slate-950">
                        {item.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.quantity && (
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-100">
                            {item.quantity}{item.units}
                          </span>
                        )}
                        {item.brand && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            {item.brand}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-slate-500">Qty {item.qty}</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-950">
                        &#x20b9;{formatPrice(item.qty * item.dprice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-fit rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.08)] md:sticky md:top-24">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items</span>
              <span className="font-bold text-slate-950">&#x20b9;{formatPrice(cart.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-bold text-slate-950">&#x20b9;{formatPrice(cart.shippingPrice)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-extrabold text-slate-950">
              <span>Total</span>
              <span>&#x20b9;{formatPrice(cart.totalPrice)}</span>
            </div>
            {error && (
              <Message variant="danger">{error.data.message}</Message>
            )}
          </div>
          <button
            type="button"
            className="mt-5 inline-flex w-auto min-w-[10rem] items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
