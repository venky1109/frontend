import { useEffect } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateCartProduct } from '../slices/cartSlice';
import { BASE_URL } from '../constants';

export const useWebSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(BASE_URL);

    socket.on('productUpdate', (updatedProduct) => {
    //   console.log('Received productUpdate from server:', updatedProduct);

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

      // Dispatch Redux action to update the cart in state
      dispatch(updateCartProduct(updatedProduct));
    });

    return () => {
      socket.off('productUpdate');
    };
  }, [dispatch]);
};
