import { apiSlice } from './apiSlice'; // Import the common API slice configuration

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to fetch all categories
    getAllCategories: builder.query({
      query: () => ({
      url:'/api/products/categories',
      method: 'GET',}
      ),
      keepUnusedDataFor: 5, // Cache duration in seconds
      providesTags: ['Category'], // Cache tag for refetching

    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllCategoriesQuery, // Hook to fetch all categories
} = categoryApiSlice;
