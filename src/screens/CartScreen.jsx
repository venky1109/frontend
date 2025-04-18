import { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userInfo = useSelector((state) => state.auth.userInfo); // Assuming you have userInfo
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
const subtotal = cartItems.reduce((acc, item) => acc + item.dprice * item.qty, 0).toFixed(2);

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

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row mt-20 mb-20">
      <div className="md:w-2/3 p-4">
        <button onClick={goBackHandler} className="text-green-600 hover:text-green-800 p-2 border border-green-600 rounded mb-4 inline-block">
          Go Back
        </button>
        <h5 className="text-xl font-semibold mb-4">Shopping Cart</h5>
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={`${item.productId}-${item.financialId}`} className="flex items-center border-b pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                <div className="flex-1">
                  <Link to={`/product/${item.slug}`} className="text-green-700 font-semibold hover:text-green-900">
                    {item.name}
                  </Link>
                  <p className="text-sm">
                    (<s>&#x20b9;{item.price}</s> <b>&#x20b9;{item.dprice}</b> per pack)
                  </p>
                  <p className="text-sm">{item.quantity}{item.units}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm">
                    <s>&#x20b9;{item.price * item.qty}</s> <b>&#x20b9;{item.dprice * item.qty}</b>
                  </p>
                  <p className="text-sm">
                    (&#x20b9;{item.dprice} x {item.qty})
                  </p>
                </div>
                <div className="flex items-center">
                  <select
                    className="border border-gray-300 rounded p-1 mx-2"
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                  >
                    {[...Array(item.countInStock + 1).keys()].map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item.productId, item.brand, item.quantity)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="md:w-1/3 p-4">
  <div className="border p-4 rounded-lg">
    <h5 className="text-lg font-semibold mb-4">
      Subtotal ({totalItems} items) : &#x20b9;{subtotal}
    </h5>
    <button
      type="button"
      className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
      disabled={cartItems.length === 0}
      onClick={checkoutHandler}
    >
      Proceed To Checkout
    </button>
  </div>
</div>
    </div>
  );
};

export default CartScreen;
