import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    getUserByPhoneNo: builder.query({
      query: (PhoneNo) => ({
        url: `${USERS_URL}/${PhoneNo}`,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // Delivery Address Endpoints
    addDeliveryAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/address`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getDeliveryAddress: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/address`,
      }),
      providesTags: ['User'],
    }),
    updateDeliveryAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}/address`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteDeliveryAddress: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/address`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
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
