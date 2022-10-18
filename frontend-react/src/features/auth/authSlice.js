import {createSlice} from "@reduxjs/toolkit"
import {authApiSlice} from "../../api/authApiSlice";


const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, access_token: null, refresh_token:null, isAuthenticated: null, isManager: null, department: null,},
    reducers: {
        setCredentials: (state, action) => {
            const {access} = action.payload
            state.access_token = access
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApiSlice.endpoints.login.matchFulfilled,
            (state, {payload}) => {

                if (payload.user.department) {
                    state.access_token = payload.access_token
                    state.refresh_token = payload.refresh_token
                    state.user = payload.user
                    state.isAuthenticated = !!payload.access_token
                    state.isManager = !!payload.user.designation.is_manager
                    state.department = payload.user.department.title
                } else {
                    state.department = true
                }
            }
        )
    },
})

export const {setCredentials} = authSlice.actions
export default authSlice.reducer
// export  const selectCurrentUser = (state) => state.auth.user
// export  const selectCurrentToken = (state) => state.auth.token
export const isAuthenticated = (state) => state.auth.isAuthenticated
export const isManager = (state) => state.auth.isManager
export const department = (state) => state.auth.department
