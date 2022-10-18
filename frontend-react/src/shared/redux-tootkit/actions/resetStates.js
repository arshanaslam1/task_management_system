import {createSlice} from "@reduxjs/toolkit";

const ResetSlice = createSlice({
    name: 'resetStates',
    initialState: {},
    reducers: {
        // ...
        clearResults() {
            // Note that this should be left intentionally empty.
            // Clearing redux state and localForage happens in rootReducer.ts.
        },
    },
})
export const { clearResults } = ResetSlice.actions
export default ResetSlice.reducer