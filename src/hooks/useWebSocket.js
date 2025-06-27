import { useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateCartProduct } from '../slices/cartSlice';
import { BASE_URL } from '../constants';

export const useWebSocket = (enabled = true) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return; // ✅ Prevent connection if disabled

    const socket = io(BASE_URL);

    socket.on('connect', () => {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
      socket.emit('clientCart', localStorageCart.cartItems);
    });

    socket.on('productUpdate', (updatedProduct) => {
      const localStorageCart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };

      const updatedCartItems = localStorageCart.cartItems.map((item) => {
        if (item.productId === updatedProduct._id.toString()) {
          const matchingDetails = updatedProduct.details.find(
            (detail) => detail._id.toString() === item.brandId
          );

          if (matchingDetails) {
            const matchingFinancial = matchingDetails.financials.find(
              (financial) => financial._id.toString() === item.financialId
            );

            if (matchingFinancial) {
              return {
                ...item,
                dprice: matchingFinancial.dprice,
                price: matchingFinancial.price,
                countInStock: matchingFinancial.countInStock,
                Discount: matchingFinancial.Discount,
              };
            }
          }
        }
        return item;
      });

      const updatedCart = { ...localStorageCart, cartItems: updatedCartItems };
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      dispatch(updateCartProduct(updatedProduct));
    });

    return () => {
      socket.off('productUpdate');
      socket.disconnect(); // ✅ Disconnect on cleanup
    };
  }, [dispatch, enabled]);
};
