
import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get products
    getProducts: builder.query({
      query: ({ keyword = '', pageNumber = 1 } = {} ) => ({
        url: PRODUCTS_URL,
        method: 'GET', // Explicitly specify method for axios
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductsByCategory: builder.query({
        query: (category) => ({
          url: `/api/products/categories/${category}/products`,
          method: 'GET', // Explicitly specify method for axios
        }),
      keepUnusedDataFor: 5, // Cache duration in seconds
      providesTags: (result, error, category) => [{ type: 'Products', id: category }], // Provides specific tag for refetching
    }),
  

    // // Query to get product details by ID
    // getProductDetails: builder.query({
    //   query: (productId) => ({
    //     url: `${PRODUCTS_URL}/${productId}`,
    //     method: 'GET', // Explicitly specify method for axios
    //   }),
    //   keepUnusedDataFor: 5,
    //   providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    // }),
// Query to get product details by Slug
getProductDetails: builder.query({
  query: (slug) => ({
    url: `${PRODUCTS_URL}/${slug}`,  // ✅ Now fetching by slug
    method: 'GET',
  }),
}),


    // Mutation to create a new product detail
    createProductDetail: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/details`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    // Mutation to create financial detail for a product
    createFinancialDetail: builder.mutation({
      query: ({ productId, detailId }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}/financials`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    getFinancialDetails: builder.query({
      query: ({ productId, detailId, financialId }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}/financials/${financialId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    batchGetFinancialDetails: builder.query({
      query: (items) => ({
        url: `${PRODUCTS_URL}/financials/batch`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content type
        },
        data: { items }, // Axios uses `data` for the POST body
      }),
    }),
   

    // Mutation to create a new product
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        data: newProduct, // Use `data` instead of `body` for axios
      }),
      invalidatesTags: ['Products'],
    }),

    // Mutation to update a product
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Mutation to upload a product image
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        data, // Use `data` for the request payload
      }),
      invalidatesTags: ['Products'],
    }),

    // Mutation to delete a product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    // Mutation to delete a product detail
    deleteProductDetail: builder.mutation({
      query: ({ productId, detailId }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Mutation to update product details
    updateProductDetail: builder.mutation({
      query: ({ productId, detailId, ...data }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data, // Use `data` to send the payload
      }),
    }),

    // Mutation to create a product review
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        data, // Use `data` to send the payload
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),

    // Query to get top products
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
        method: 'GET', // Explicitly specify method for axios
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
  }),
});

// Export hooks for the defined queries and mutations
export const {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductDetailsQuery,
  useCreateProductDetailMutation,
  useCreateFinancialDetailMutation,
  useGetFinancialDetailsQuery,
  useBatchGetFinancialDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useDeleteProductDetailMutation,
  useUpdateProductDetailMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
