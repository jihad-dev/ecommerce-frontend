import { baseApi } from "../../api/baseApi";
import { IUser } from "../../../types/user.types";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo: any) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo,
            }),
        }),
        // register
        register: builder.mutation({
            query: (userInfo: any) => ({
                url: '/users/create-user',
                method: 'POST',
                body: userInfo,
            }),
        }),
        getSingleUser: builder.query<IUser, string>({
            query: (id: string) => ({
                url: `/users/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data,
        }),
       
    }),
})

export const { useLoginMutation, useGetSingleUserQuery, useRegisterMutation} = authApi;
