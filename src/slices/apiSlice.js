import axios from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice'; // Import the logout action

// Custom baseQuery function using axios
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        withCredentials: true, // Include credentials such as cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Custom baseQuery function that handles 401 Unauthorized responses
async function baseQueryWithAuth(args, api, extra) {
  const result = await axiosBaseQuery({ baseUrl: BASE_URL })(args);

  // Check if the response contains a 401 error
  if (result.error && result.error.status === 401) {
    console.log('Unauthorized: Logging out the user'); // Debugging output
    // Dispatch the logout action to clear user data and redirect
    api.dispatch(logout());
  }

  return result;
}

// Define a shared API slice configuration without specific endpoints
export const apiSlice = createApi({
  reducerPath: 'api', // Optional: Define a custom reducer path for this API slice
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery with authorization handling
  tagTypes: ['Product', 'Order', 'User'], // Define tags for cache invalidation and refetching
  endpoints: () => ({}), // No endpoints are defined here; they are defined in respective slices
});
