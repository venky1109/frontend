import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../constants';

export const handleOnlinePayment = createAsyncThunk(
    'payment/handleOnlinePayment',
    async (paymentData, { rejectWithValue }) => {
      try {
        // console.log('Sending payment request to backend:', paymentData);
        const { data } = await axios.post(
          `${BASE_URL}/api/payments/initiateJuspayPayment`, // Correct the endpoint if needed
          paymentData
        );
        // console.log('Payment response from backend:', data);
        return data; // Return success response
      } catch (error) {
        console.error('Error in payment request:', error.response?.data || error.message);
        return rejectWithValue(error.response?.data || error.message); // Handle errors
      }
    }
  );

  export const handleOrderPayment = createAsyncThunk(
    'payment/handleOrderPayment',
    async (paymentData, { rejectWithValue }) => {
      try {
        console.log('Sending order payment request to backend:', paymentData);
  
        const { data } = await axios.post(
          `${BASE_URL}/api/payments/initiateJuspayPaymentAtDelivery`, // Backend endpoint for retry payments
          paymentData
        );
  
        // console.log('Order payment response from backend:', data);
  
        return data; // Return success response
      } catch (error) {
        console.error(
          'Error initiating retry payment:',
          error.response?.data || error.message
        );
        return rejectWithValue(error.response?.data || error.message); // Return error
      }
    }
  );
  

const paymentApiSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentResponse: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.paymentResponse = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleOnlinePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleOnlinePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResponse = action.payload;
      })
      .addCase(handleOnlinePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // 🎯 Add handling for order payment (retry)
       .addCase(handleOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleOrderPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResponse = action.payload;
      })
      .addCase(handleOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentApiSlice.actions;
export default paymentApiSlice.reducer;

