import React from 'react';
import {useSelector} from "react-redux";
import {Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useTheme} from '@mui/material/styles';
import {Box, CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid";
import {employee, selectAfterDate, selectBeforeDate} from "./dashSlice";
import {useGetTasksQuery} from "../../api/dashboardapiSlice";
import Title from '../../shared/components/Title';
import FilterByDateTimeBetweenDialog from "./filterbytimedialog";


const Chart=()=> {
    const fromDate = useSelector(selectAfterDate);
    const toDate = useSelector(selectBeforeDate)
    const {data: TasksData, isLoading, isError} = useGetTasksQuery({
        end_time_after: fromDate,
        end_time_before: toDate,
        assigned: useSelector(employee),
        status: "complete"
    });
    const theme = useTheme();
    const parseFromDate = new Date(Date.parse(fromDate))
    const parseToDate = new Date(Date.parse(toDate))


    return (
        <React.Fragment>
            {(isLoading || isError) ? (
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{minHeight: '50vh'}}
                >

                    <Grid item xs={3}>
                        <Box sx={{display: 'flex'}}>
                            {(isLoading) && <CircularProgress/>}
                            {(isError) && "Oops! Error"}
                        </Box>
                    </Grid>

                </Grid>
            ) : (
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <Title>{parseFromDate.toDateString()} - {parseToDate.toDateString()}</Title>
                            </Grid>
                            <Grid item xs={12} sm={6} align='right'>
                                <FilterByDateTimeBetweenDialog/>
                            </Grid>
                        </Grid>
                        <ResponsiveContainer>
                            <LineChart
                                data={TasksData}
                                margin={{
                                    top: 14,
                                    right: 16,
                                    bottom: 0,
                                    left: 24,
                                }}
                            >
                                <XAxis
                                    dataKey="title"
                                    stroke={theme.palette.text.secondary}
                                    style={theme.typography.body2}
                                />
                                <YAxis

                                    dataKey="consumed_hours"
                                    stroke={theme.palette.text.secondary}
                                    style={theme.typography.body2}
                                >
                                    <Label
                                        angle={270}
                                        position="left"
                                        style={{
                                            textAnchor: 'middle',
                                            fill: theme.palette.text.primary,
                                            ...theme.typography.body1,
                                        }}
                                    >
                                        Time
                                    </Label>
                                </YAxis>
                                <Tooltip/>
                                <Line
                                    isAnimationActive={true}
                                    type="monotone"
                                    dataKey="consumed_hours"
                                    stroke={theme.palette.primary.main}
                                    dot={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                )
            }
        </React.Fragment>
    );
}

export default Chart;
