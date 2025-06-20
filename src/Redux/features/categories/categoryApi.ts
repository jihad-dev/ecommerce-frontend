import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder: any) => ({
        getAllCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Categories'],
            transformResponse: (response: any) => {
                return response?.data;
            }
        }),
        addCategory: builder.mutation({
            query: (data: any) => ({
                url: '/categories',
                method: 'POST',
                body: data  
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
})

export const { useGetAllCategoriesQuery, useAddCategoryMutation } = categoryApi;
