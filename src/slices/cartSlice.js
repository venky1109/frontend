import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
    
      const existItem = state.cartItems.find(
        (x) =>
          x.productId === item.productId &&
          x.brand === item.brand &&
          x.quantity === item.quantity
      );
    
      if (existItem) {
        // If the item exists, update the quantity by adding only 1 to the existing qty
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId &&
          x.brand === existItem.brand &&
          x.quantity === existItem.quantity
            ? { ...existItem, qty: existItem.qty + 1 }
            : x
        );
      } else {
        // If the item does not exist, add it to the cart with the initial qty of 1
        state.cartItems = [...state.cartItems, { ...item, qty: 1 }];
      }
    
      return updateCart(state, item); // Assuming updateCart recalculates totals or other necessary state
    },
    // removeFromCart: (state, action) => {
    //   console.log(action.payload);
    //   state.cartItems = state.cartItems.filter((x) => x.productId !== action.payload);
    //   return updateCart(state);
    // },
    removeFromCart: (state, action) => {
      const { productId, brand, quantity } = action.payload;
      console.log(action.payload);
      console.log('before removal from cart '+state.cartItems);
      
      // Filter out the items that match the provided productId, brand, and 
      console.log(quantity);
      state.cartItems.forEach(item => {
        console.log(`Item: ${item.productId} - Brand: ${item.brand} - Quantity: ${item.quantity}`);
      });
      state.cartItems = state.cartItems.filter((item) => {
return !(item.productId === productId && item.brand === brand && item.quantity===quantity);
      });
      console.log('after removal from cart '+state.cartItems);
      
      // After filtering, update the cart state
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
