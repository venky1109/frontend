import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Initial cart state from local storage or default values
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      // Check if the item already exists in the cart
      const existItem = state.cartItems.find(
        (x) =>
          x.productId === item.productId &&
          x.brand === item.brand &&
          x.quantity === item.quantity
      );

      if (existItem) {
        // If the item exists, increment its quantity
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId &&
          x.brand === existItem.brand &&
          x.quantity === existItem.quantity
            ? { ...existItem, qty: item.qty }
            : x
        );
      } else {
        // If the item does not exist, add it to the cart with an initial quantity of 1
        state.cartItems = [...state.cartItems, { ...item, qty:item.qty|| 1 }];
      }

      // Update the cart state
      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      const { productId, brand, quantity } = action.payload;
      console.log(`Before removal: ${JSON.stringify(state.cartItems)}`);
      
      // Remove the specific item from the cart based on productId, brand, and quantity
      state.cartItems = state.cartItems.filter(
        (item) => !(item.productId === productId && item.brand === brand && item.quantity === quantity)
      );
      
      console.log(`After removal: ${JSON.stringify(state.cartItems)}`);

      // Update the cart state after removal
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
    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => {
      state = initialState; // Reset the cart state to initial values
      localStorage.setItem('cart', JSON.stringify(state));
    },
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
