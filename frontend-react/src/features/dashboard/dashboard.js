import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Outlet} from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Chart from "./timechartcard";
import {Backdrop, CircularProgress, Paper} from "@mui/material";
import {useGetCombineReportQuery} from "../../api/dashboardapiSlice";
import {employee, selectAfterDate, selectBeforeDate, setDataGridData} from "./dashSlice";
import StatusCardWithLink from "./statuscardwithlink";
import StatusCard from "./statuscard";


const upComingDate = () => {
    const curDate = new Date();
    curDate.setHours(0)
    curDate.setMinutes(0)
    curDate.setSeconds(0)
    curDate.setMilliseconds(0)
    curDate.setDate(curDate.getDate() + 7);
    return curDate.toISOString()
}
const upComingAfterDate = () => {
    const curDate = new Date();
    return curDate.toISOString()
}

const Dashboard=()=> {
    const beforeDate = useSelector(selectBeforeDate);
    const afterDate = useSelector(selectAfterDate);
    const emp = useSelector(employee);
    const dispatch = useDispatch();
    const {data: StatusReport, isLoading, isError} = useGetCombineReportQuery({
        end_date_after: afterDate,
        end_date_before: beforeDate,
        assigned: emp
    });

    useEffect(() => {
        dispatch(setDataGridData({
            'title': 'Upcoming Deadlines',
            'query': {end_time_after: upComingAfterDate(), end_time_before: upComingDate(), status: "pending", assigned: emp}
        }));
    }, );

    const updateDataGridDataTitle = title => {
        let obj = {status: "complete", assigned: emp}
        if (title === "Worked Hours") {
            obj = {
                "title": title,
                "query": {end_time_after: afterDate, end_time_before: beforeDate, status: "complete", assigned: emp}
            }
        } else if (title === "Upcoming Deadlines") {
            obj = {
                "title": title,
                "query": {
                    end_time_after: upComingAfterDate(),
                    end_time_before: upComingDate(),
                    status: "pending",
                    assigned: emp
                }
            }
        } else if (title === "Pending") {
            obj = {
                "title": title,
                "query": {end_time_after: afterDate, end_time_before: beforeDate, status: "pending", assigned: emp}
            }
        } else if (title === "complete") {
            obj = {
                "title": title,
                "query": {end_time_after: afterDate, end_time_before: beforeDate, status: "complete", assigned: emp}
            }
        } else if (title === "Total") {
            obj = {"title": title, "query": {end_time_after: afterDate, end_time_before: beforeDate, assigned: emp}}
        }
        dispatch(setDataGridData(obj));
    }
    return (
        <>
            {isLoading || isError ?
                (
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme}}
                        open={true}
                    >
                        {isLoading && (<CircularProgress color="inherit"/>)}
                        {isError && (<CircularProgress color="inherit"/>)}
                    </Backdrop>
                ) :
                    (
                        <>
                            <Grid item xs={12} md={4} lg={9}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <Chart/>
                                </Paper>
                            </Grid>
                            {/* status cards */}
                            <StatusCard title="Worked Hours" count={StatusReport["Worked Hours"]}/>
                            <StatusCardWithLink title="Upcoming Deadlines" count={StatusReport["Upcoming Deadline"]}
                                                updateDataGridData={updateDataGridDataTitle}/>
                            <StatusCardWithLink title="Pending" count={StatusReport["Pending Tasks"]}
                                                updateDataGridData={updateDataGridDataTitle}/>
                            <StatusCardWithLink title="complete" count={StatusReport["Complete Tasks"]}
                                                updateDataGridData={updateDataGridDataTitle}/>
                            <StatusCardWithLink title="Total" count={StatusReport["Total Tasks"]}
                                                updateDataGridData={updateDataGridDataTitle}/>
                            <Outlet/>
                        </>
                    )
            }
        </>
    );
}

export default Dashboard;
