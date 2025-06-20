import { baseApi } from "../../api/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['cart'],
      transformResponse: (response: any) => {
        return response?.data;
      }
    }),
    addToCart: builder.mutation({
      query: (data: any) => ({
        url: '/cart/add-to-cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }: any) => ({
        url: `/cart/update-cart`,
        method: 'PUT',
        body: { productId, quantity },
      }),
      invalidatesTags: ['cart'],
    }),
    removeFromCart: builder.mutation({
      query: ({ productId }: any) => ({
        url: `/cart/remove-from-cart/${productId}`,
        method: 'DELETE',
        body: { productId },
      }),
      invalidatesTags: ['cart'],
    }),
    
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear-cart`,
        method: 'DELETE',
      }),
      invalidatesTags: ['cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
