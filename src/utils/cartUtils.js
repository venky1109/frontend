export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export const updateCart = (state) => {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
console.log(state.cartItems);
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.dprice * 100 * item.qty) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 0;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate the tax price
  // const taxPrice = 0.15 * itemsPrice;
  // state.taxPrice = addDecimals(taxPrice);

  const totalPrice = itemsPrice + shippingPrice ;
  // Calculate the total price
  state.totalPrice = addDecimals(totalPrice);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));
  console.log(state.cartItems);

  return state;
};
