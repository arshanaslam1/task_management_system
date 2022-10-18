import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { Mutex } from 'async-mutex';
import {setCredentials} from "../features/auth/authSlice";
import {clearResults} from "../shared/redux-tootkit/actions/resetStates";
import apiConfig from "../config/APIConfig";

// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: apiConfig.BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.access_token
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})


const baseQueryWithReAuth = async (args, api, extraOption) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOption)


    if (result?.meta?.response?.status ===401 ) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try{
                //send refresh token to get new access token
                const refreshResult = await baseQuery({url: apiConfig.REFRESH_TOKEN, method: 'POST',
                    body:{refresh:api.getState().auth.refresh_token}}, api, extraOption)
                if (refreshResult?.data?.access){
                    //store new token
                    api.dispatch(setCredentials({access:refreshResult.data.access}))
                    //retry the original query with new token
                    result = await  baseQuery(args, api, extraOption)
                }
                else
                {
                    api.dispatch(clearResults())
                }
            }finally {
                // release must be called once the mutex should be released again.
                release()
            }
        }else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOption)
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({}),
})
