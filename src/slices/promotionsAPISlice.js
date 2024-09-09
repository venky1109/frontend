import { apiSlice } from './apiSlice'; // Import the existing apiSlice
import {  PROMOTIONS_URL } from '../constants';

// Extend the apiSlice with promotion-specific endpoints
export const promotionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchPromotions: builder.query({
      query: () => ({
        url: `${PROMOTIONS_URL}`, // Base URL is already set in apiSlice
        method: 'GET',
      }),
      providesTags: ['Promotion'], // Specify tags for cache invalidation
    }),
    fetchPromotionById: builder.query({
      query: (id) => ({
        url: `${PROMOTIONS_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Promotion', id }],
    }),
    fetchPromotionsByTitle: builder.query({
      query: (title) => ({
        url: `${PROMOTIONS_URL}`,
        method: 'GET',
        params: { title }, // Pass the title as a query parameter
      }),
      providesTags: ['Promotion'],
    }),
    fetchPromotionsByDuration: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${PROMOTIONS_URL}`,
        method: 'GET',
        params: { startDate, endDate }, // Pass startDate and endDate as query parameters
      }),
      providesTags: ['Promotion'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useFetchPromotionsQuery,
  useFetchPromotionByIdQuery,
  useFetchPromotionsByTitleQuery,
  useFetchPromotionsByDurationQuery,
} = promotionApiSlice;
