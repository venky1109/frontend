import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to handle user login
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Login response:', data); // Log the full response
          console.log('Token received:', data.token); // Log the token specifically
    
          // if (data.token) {
          //   localStorage.setItem('authToken', data.token);
          //   console.log('Token stored in local storage:', localStorage.getItem('authToken')); // Log the stored token
          // } else {
          //   console.error('Token not found in response');
          // }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      },
    }),
 

    // Mutation to handle user registration
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: ['User'], // Invalidate the cache to refresh user data
    }),

    // Mutation to handle forgotten password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        data, // Use `data` for the request payload
      }),
    }),

    // Mutation to handle user logout
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    // Mutation to update user profile
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: ['User'], // Invalidate cache to refresh user profile data
    }),

    // Query to get all users (admin)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: 'GET', // Explicitly specify method for axios
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // Query to get a user by phone number
    getUserByPhoneNo: builder.query({
      query: (PhoneNo) => ({
        url: `${USERS_URL}/${PhoneNo}`,
        method: 'GET', // Explicitly specify method for axios
      }),
      providesTags: (result, error, PhoneNo) => [{ type: 'User', id: PhoneNo }], // Specific cache tag
    }),

    // Mutation to delete a user by ID
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }], // Invalidate cache for deleted user
    }),

    // Query to get user details by ID
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: 'User', id }], // Provide tag for cache invalidation
    }),

    // Mutation to update user details
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }], // Invalidate cache for updated user
    }),

    // Delivery Address Endpoints

    // Mutation to add a delivery address for a user
    addDeliveryAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/address`,
        method: 'POST',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }], // Invalidate cache for the user's addresses
    }),

    // Query to get delivery addresses (potentially for admin)
    getDeliveryAddress: builder.query({
      query: () => ({
        url: `${USERS_URL}/address`, // Endpoint to fetch all addresses
        method: 'GET', // Explicitly specify method for axios
      }),
      providesTags: ['User'], // General 'User' tag
    }),

    // Mutation to update a delivery address for a user
    updateDeliveryAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/address`,
        method: 'PUT',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }], // Invalidate cache for updated address
    }),

    // Mutation to delete a delivery address for a user
    deleteDeliveryAddress: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/address`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [{ type: 'User', id: userId }], // Invalidate cache for the user's addresses
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetUserByPhoneNoQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useAddDeliveryAddressMutation,
  useGetDeliveryAddressQuery,
  useUpdateDeliveryAddressMutation,
  useDeleteDeliveryAddressMutation,
} = userApiSlice;
