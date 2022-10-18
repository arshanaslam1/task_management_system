import React, {useState}  from 'react';
import {useSelector} from "react-redux";
import {DataGrid} from '@mui/x-data-grid';
import {Box, CircularProgress, Grid, Paper} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import ListItemButton from "@mui/material/ListItemButton";
import {dataGridData} from "./dashSlice";
import {useGetTasksQuery} from "../../api/dashboardapiSlice";
import TaskViewDialog from "./viewdialog";
import Title from "../../shared/components/Title";


const FixedSizeGrid=()=> {
    const {title, query} = useSelector(dataGridData);
    const [viewDialog, SetViewDialog] = useState(false);
    const [value, setValue] = useState();
    const {data: TasksData, isLoading, isError} = useGetTasksQuery(query);

    const handleOpenViewDialog = (value) => {
        setValue(value);
        SetViewDialog(true);
    };

    const handleCloseViewDialog = () => {
        SetViewDialog(false);
    };

    const columns: ColDef[] = [
        {
            field: "id",
            headerName: "Task ID",
            width: 100,
            renderCell: (params) => (

                <>
                    {params.value}
                    <ListItemButton onClick={() => {
                        handleOpenViewDialog(params.value)
                    }}>
                        <PreviewIcon/>
                    </ListItemButton>
                </>

            )
        },
        {field: "title", headerName: "Title", width: 200},
        {field: "body", headerName: "Description", width: 150},
        {field: "status", headerName: "Status", width: 100},
        {
            field: "start_time",
            headerName: "Start time",
            type: "string",
            width: 250,
            renderCell: (params) => (
                <>
                    {new Date(params.value).toUTCString()}
                </>
            )
        },
        {
            field: "end_time",
            headerName: "DeadLine",
            type: "string",
            width: 250,
            renderCell: (params) =>
                (
                    <>

                        {
                            new Date(params.value).toUTCString()
                        }

                    </>
                )

        },
        {
            field: "assigned_data",
            headerName: "Assigned",
            width: 150,
            renderCell: (params) => (
                <>
                    {`${params.value.first_name} ${params.value.last_name}`}
                </>
            )
        },
        {
            field: "owner_data",
            headerName: "Owner",
            width: 150,
            renderCell: (params) => (
                <>
                    {`${params.value.first_name} ${params.value.last_name}`}
                </>
            )
        },
    ];

    return (
        <Grid item xs={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',}}>
                <div style={{height: 500, width: '100%'}}>
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
                    )
                        : (
                            <>
                                <TaskViewDialog id={value} open={viewDialog}
                                                handleCloseViewDialog={handleCloseViewDialog}/>
                                <Title>{title.toUpperCase()}</Title>
                                <div style={{height: 450, width: '100%'}}>
                                    <DataGrid columns={columns} rows={TasksData}/>
                                </div>
                            </>
                        )}
                </div>
            </Paper>
        </Grid>
    );
}

export default FixedSizeGrid;
