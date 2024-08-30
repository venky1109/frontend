import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      // Clear local storage to ensure no leftover data from the previous session
      localStorage.removeItem('userInfo'); // Only remove user-specific info
      localStorage.removeItem('cart'); // Remove cart information if stored
      localStorage.removeItem('shippingAddress'); // Remove shipping address if stored
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
