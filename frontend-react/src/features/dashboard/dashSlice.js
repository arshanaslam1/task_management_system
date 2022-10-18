import {createSlice} from "@reduxjs/toolkit"
import {authApiSlice} from "../../api/authApiSlice";

const AfterDates = () => {
    const curDate = new Date();
    curDate.setHours(0)
    curDate.setMinutes(0)
    curDate.setSeconds(0)
    curDate.setMilliseconds(0)
    curDate.setDate(curDate.getDate() - 7);
    return curDate.toISOString()
}
const BeforeDates = () => {
    const curDate = new Date();
    curDate.setYear(9999)
    return curDate.toISOString()
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {afterDate: AfterDates(), beforeDate: BeforeDates(), employee: [], dataGridData: "",},
    reducers: {
        setDateTime: (state, action) => {
            const {afterDate, beforeDate} = action.payload
            state.afterDate = afterDate
            state.beforeDate = beforeDate
        },
        setEmployee: (state, action) => {
            const {personName} = action.payload
            state.employee = personName
            console.log(state.employee)
        },
        setCurrentSevenDays: (state) => {
            const curDate = new Date();
            const lastDayOfSevenDays = curDate.getDate() - 7;
            curDate.setDate(lastDayOfSevenDays);
            state.beforeDate = new Date().toISOString();
            state.afterDate = curDate.toISOString();
        },
        setCurrentMonth: (state,) => {
            const curDate = new Date();
            curDate.setDate(2);
            curDate.setHours(0)
            curDate.setMinutes(0)
            curDate.setSeconds(0)
            curDate.setMilliseconds(0)
            state.beforeDate = new Date().toISOString();
            state.afterDate = curDate.toISOString();
        },
        setLastMonth: (state) => {
            const curDate = new Date();
            const lastMonth = curDate.getMonth() - 1;
            curDate.setMonth(lastMonth);
            curDate.setDate(2);
            curDate.setHours(0)
            curDate.setMinutes(0)
            curDate.setSeconds(0)
            curDate.setMilliseconds(0)
            state.afterDate = curDate.toISOString();
            const bDate = new Date();
            bDate.setDate(1);
            bDate.setHours(0)
            bDate.setMinutes(0)
            bDate.setSeconds(0)
            bDate.setMilliseconds(0)
            state.beforeDate = bDate.toISOString();
        },

        setDataGridData: (state, action) => {
            const {title, query} = action.payload
            state.dataGridData = {title, query}
        },

    },

    extraReducers: (builder) => {
        builder.addMatcher(
            authApiSlice.endpoints.login.matchFulfilled,
            (state) => {
                state.employee = [];
            },
        )
    },
})

export const {
    setDateTime,
    setCurrentSevenDays,
    setEmployee,
    setCurrentMonth,
    setLastMonth,
    setDataGridData
} = dashboardSlice.actions
export default dashboardSlice.reducer
export const selectBeforeDate = (state) => state.dashboard.beforeDate
export const selectAfterDate = (state) => state.dashboard.afterDate
export const employee = (state) => state.dashboard.employee
export const dataGridData = (state) => state.dashboard.dataGridData
