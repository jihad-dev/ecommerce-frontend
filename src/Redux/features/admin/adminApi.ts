import { baseApi } from "../../api/baseApi";


const adminApi = baseApi.injectEndpoints({
   endpoints: (builder: any) => ({
      getAllUsers: builder.query({
         query: () => '/users/all-user',
         method: 'GET',
         providesTags: ['users']
      }),
      getAllAdmins: builder.query({
         query: () => ({
            url: '/users/all-admin',
            method: 'GET',
         }),
         providesTags: ['admins'],
         transformResponse: (response: any) => response?.data,
      }),
      changeStatus: builder.mutation({
         query: (data: { id: string, status: string }) => ({
            url: `/users/status/${data?.id}`,
            method: 'PATCH',
            body: {
               status: data?.status
            }
         }),
         invalidatesTags: ['users']
      }),
      //create admin
      createAdmin: builder.mutation({
         query: (data: any) => ({
            url: '/users/create-user',
            method: 'POST',
            body: data
         }),
         invalidatesTags: ['admins']
      }),
      //get single admin
      getSingleAdmin: builder.query({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'GET',
         }),
         providesTags: ['admins']
      }),
      //delete admin
      deleteAdmin: builder.mutation({
         query: (id: string) => ({
            url: `/users/admin/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['admins']
      }),
      //delete user
      deleteUser: builder.mutation({
         query: (id: string) => ({
            url: `/users/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: ['users']
      })

   })
})

export const { useGetAllUsersQuery, useChangeStatusMutation, useCreateAdminMutation, useGetSingleAdminQuery, useDeleteAdminMutation, useDeleteUserMutation, useGetAllAdminsQuery } = adminApi;
