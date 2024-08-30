import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

// Inject endpoints into the existing API slice
export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a new order
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        data: order, // Use `data` instead of `body` for axios
      }),
      invalidatesTags: ['Order'], // Invalidate 'Order' cache to refresh the list of orders
    }),

    // Query to get order details by ID
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: 'Order', id }], // Provide tag for cache invalidation
    }),

    // Mutation to pay for an order
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        data: details, // Use `data` for the request payload
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }], // Invalidate the cache for the specific order
    }),

    // Query to get the PayPal client ID
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
    }),

    // Query to get orders of the logged-in user
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'], // Provide a general 'Order' tag
    }),

    // Query to get all orders (admin)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'], // Provide a general 'Order' tag
    }),

    // Mutation to mark an order as delivered
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }], // Invalidate cache for the delivered order
    }),
  }),
});

// Export hooks for the defined queries and mutations
export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = orderApiSlice;
