import {apiSlice} from "./apiSlice";
import apiConfig from "../config/APIConfig";


const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['UsersListData', 'StatusReport', 'Reports', 'TaskData', 'TaskDetail']});
const queryString = require('query-string');


export const reportApiSlice = apiWithTag.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: apiConfig.USER_LIST,
            }),
            providesTags: (result, error, id) => [{type: 'UsersListData', id}],
        }),
        getCombineReport: builder.query({
            query: (obj) => {
                let q = queryString.stringify(obj);
                return {
                    url: `${apiConfig.EMPLOYEE_COMBINE_REPORT}?${q}`,
                }
            },
            providesTags: (result, error, id) => [{type: 'StatusReport', id}],
        }),
        getReports: builder.query({
            query: (obj) => {
                let q = queryString.stringify(obj);
                return {
                    url: `${apiConfig.REPORTS}?${q}`,
                }
            },
            providesTags: (result, error) => [{type: 'Reports'}],
        }),
        getTasks: builder.query({
            query: (obj) => {
                let q = queryString.stringify(obj);
                return {
                    url: `${apiConfig.TASKS}?${q}`,
                }
            },
            providesTags: (result, error, id) => [{type: 'TasksData', id}],
        }),
        getTasksDetail: builder.query({
            query: (id) => ({
                url: `${apiConfig.TASKS}${id}/`,
            }),
            providesTags: (result, error, id) => [{type: 'TaskDetail', id}],

        }),
        addTask: builder.mutation({
            query: (payload) => ({
                url: apiConfig.TASKS,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: (result, error, id) => [{type: 'TasksData'}, {type: 'StatusReport'}, {type: 'Reports'}],
        }),
        updateTask: builder.mutation({
            query: ({id, payload}) => ({
                url: `${apiConfig.TASKS}${id}/`,
                method: 'PATCH',
                body: payload
            }),
            invalidatesTags: (result, error, id) => [{type: 'TasksData'}, {type: 'StatusReport'}, {type: 'TaskDetail'}, {type: 'Reports'}],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `${apiConfig.TASKS}${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{type: 'TasksData'}, {type: 'StatusReport'}, {type: 'EmployeeReports'}, {type: 'Reports'}],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetCombineReportQuery,
    useGetReportsQuery,
    useGetTasksQuery,
    useGetTasksDetailQuery,
    useAddTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = reportApiSlice
