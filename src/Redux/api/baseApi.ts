import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store"; // Assuming your RootState is exported from here

const baseQuery = fetchBaseQuery({
  baseUrl: "https://e-commerce-backend-zeta-five.vercel.app/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Add { getState } parameter
    const token = (getState() as RootState).auth.token; // Use getState() to access the token
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

// token expired hola new refresh token generate code
const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 404) {
    toast.error((result?.error?.data as any)?.message);
  }
  if (result?.error?.status === 403) {
    toast.error((result?.error?.data as any)?.message);
  }
  if (result?.error?.status === 401) {
    const res = await fetch(
      "https://e-commerce-backend-zeta-five.vercel.app/api/v1/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data?.data?.accessToken) {
      // We also need to get the user state here without using a hook
      const user = (api.getState() as RootState).auth.user; // Use api.getState() here as well

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["admins", "users", "categories", "products", "cart", "orders"],
  endpoints: () => ({}),
});
