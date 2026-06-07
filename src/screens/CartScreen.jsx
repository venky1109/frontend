import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, clearCartItems, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userInfo = useSelector((state) => state.auth.userInfo);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.dprice * item.qty, 0).toFixed(2);
  const mrpTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const savings = Math.max(mrpTotal - Number(subtotal), 0).toFixed(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCartHandler = (product, qty) => {
    if (qty === 0) {
      removeFromCartHandler(product.productId, product.brand, product.quantity);
    } else {
      dispatch(addToCart({ ...product, qty }));
    }
  };

  const removeFromCartHandler = (productId, brand, quantity) => {
    dispatch(removeFromCart({ productId, brand, quantity }));
  };

  const clearCartHandler = () => {
    dispatch(clearCartItems());
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="mt-16 mb-24 bg-gradient-to-b from-emerald-50/70 via-white to-white px-3 py-5 sm:mt-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Your order</p>
            <h1 className="text-xl font-semibold text-slate-950">Shopping Cart</h1>
          </div>
          <div className="flex flex-none items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCartHandler}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50"
              >
                <FaTrash className="h-3 w-3" />
                Clear All
              </button>
            )}
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_22rem] md:items-start">
          <div>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={`${item.productId}-${item.financialId}`}
                    className="rounded-2xl border border-slate-100 bg-white p-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.06)] sm:p-3"
                  >
                    <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_5.75rem] items-center gap-2 sm:grid-cols-[4.75rem_minmax(0,1fr)_7rem] sm:gap-3">
                      <Link
                        to={`/product/${item.slug}`}
                        className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-1 sm:h-20 sm:w-20"
                      >
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </Link>

                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.slug}`}
                          className="line-clamp-2 text-xs font-extrabold leading-tight text-emerald-800 hover:text-emerald-950 sm:text-sm"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] font-semibold text-slate-600 sm:gap-1.5 sm:text-[11px]">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5">{item.quantity}{item.units}</span>
                          {item.brand && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800">{item.brand}</span>}
                        </div>

                        <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-500 sm:mt-2 sm:text-[11px]">
                          <s className="text-slate-400">&#x20b9;{item.price}</s>
                          <span className="ml-1">&#x20b9;{item.dprice} per pack</span>
                        </p>
                      </div>

                      <div className="flex min-w-0 flex-col items-end justify-center gap-1">
                        <p className="w-full text-right text-sm font-extrabold text-slate-950 sm:text-base">
                          <span className="inline-block rounded-md border border-amber-300 bg-amber-100 px-1 py-0.5">
                            &#x20b9;{(item.dprice * item.qty).toFixed(2)}
                          </span>
                        </p>
                        <p className="w-full text-right text-[10px] font-semibold text-slate-500 sm:text-[11px]">
                          &#x20b9;{item.dprice} x {item.qty}
                        </p>
                        <div className="flex w-full items-center justify-end gap-1.5">
                          <select
                            className="h-8 w-12 rounded-lg border border-emerald-200 bg-white px-1 text-center text-sm font-bold text-slate-800 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:h-9 sm:w-14"
                            value={item.qty}
                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                            aria-label={`Quantity for ${item.name}`}
                          >
                            {[...Array(item.countInStock + 1).keys()].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 shadow-sm hover:bg-red-100 sm:h-9 sm:w-9"
                            onClick={() => removeFromCartHandler(item.productId, item.brand, item.quantity)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="md:sticky md:top-24">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-slate-600">Subtotal</span>
                <span className="text-xl font-extrabold text-slate-950">&#x20b9;{subtotal}</span>
              </div>
              <div className="mb-4 space-y-2 text-sm font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Total items</span>
                  <span>{totalItems}</span>
                </div>
                {Number(savings) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>You save</span>
                    <span>&#x20b9;{savings}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="inline-flex w-auto min-w-[12rem] items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(22,163,74,0.28)] hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
