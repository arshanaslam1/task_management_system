import { apiSlice } from "./apiSlice";
import apiConfig from "../config/APIConfig";

const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['userAccountInfo']});

export const authApiSlice = apiWithTag.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (credentials) => ({
                url: apiConfig.LOGIN,
                method: 'POST',
                body: credentials
            }),
        }),
        logout: build.mutation({
            query: () => ({
                url: apiConfig.LOGOUT,
                method: 'POST',
            }),
        }),
        register: build.mutation({
            query: (credentials) => ({
                url: apiConfig.REGISTER,
                method: 'POST',
                body: credentials
            }),
        }),
        passwordChange: build.mutation({
            query: (credentials) => ({
                url: apiConfig.PASSWORD_CHANGE,
                method: 'POST',
                body: credentials
            }),
        }),
        userAccountInfo: build.query({
            query: () => ({
                url: apiConfig.USER_INFO,
                method: 'GET',
            }),
            providesTags: (result, error) => [{ type: 'userAccountInfo'}],
        }),
        updateUserAccountInfo: build.mutation({
            query: (data) => ({
                url: apiConfig.USER_INFO,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (result, error) => [{ type: 'userAccountInfo'}],
        }),

    }),
})
export const { useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUserAccountInfoQuery,
    useUpdateUserAccountInfoMutation,
    usePasswordChangeMutation,
} = authApiSlice
