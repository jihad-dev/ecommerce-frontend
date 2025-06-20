import { baseApi } from "../../api/baseApi";


const orderApi = baseApi.injectEndpoints({
    endpoints: (builder: any) => ({
        //create order
        createOrder: builder.mutation({
            query: (data: any) => ({
                url: '/orders/create-order',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['orders']
        }),
        //get all orders
        getAllOrders: builder.query({
            query: () => ({
                url: '/orders',
                method: 'GET'
            }),
            providesTags: ['orders']
        }),
        // get user orders
        getUserOrders: builder.query({
            query: (id: string) => ({
                url: `/orders/user/${id}`,
                method: 'GET'
            }),
            providesTags: ['orders']
        }),
        getOrderById: builder.query({
            query: (id: string) => ({
                url: `/orders/${id}`,
                method: 'GET'
            }),
            providesTags: ['orders']
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }: { id: string, status: string }) => ({
                url: `/orders/${id}`,
                method: 'PUT',
                body: { status }
            }),
            invalidatesTags: ['orders']
        }),
        deleteOrder: builder.mutation({
            query: (id: string) => ({
                url: `/orders/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['orders']
        }),

    }),
})

export const { useCreateOrderMutation, useGetAllOrdersQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation, useGetUserOrdersQuery} = orderApi;
