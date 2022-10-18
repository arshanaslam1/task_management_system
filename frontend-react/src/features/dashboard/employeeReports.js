import * as React from 'react';
import {useSelector} from "react-redux";
import Typography from '@mui/material/Typography';
import {Box, CircularProgress, Grid, Paper, TableRow} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Divider from "@mui/material/Divider";
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import {employee, selectAfterDate, selectBeforeDate} from "./dashSlice";
import {useGetReportsQuery} from "../../api/dashboardapiSlice";
import Title from "../../shared/components/Title";
import Accordion from "./accordion";


const EmployeeReports=()=> {
    const beforeDate = useSelector(selectBeforeDate);
    const afterDate = useSelector(selectAfterDate);
    const {data: Reports, isLoading, isError} = useGetReportsQuery({
        after_date: afterDate,
        before_date: beforeDate,
        id: useSelector(employee)
    })
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Grid item xs={12}>

            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',}}>
                <div style={{height: 540, width: '100%'}}>
                    <Title>Employee Reports</Title>
                    <Divider/>
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
                                <TableContainer sx={{maxHeight: 440}}>
                                    <Table aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell/>
                                                <TableCell>
                                                    <Typography variant="subtitle1" component="h2">
                                                        Name
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant="subtitle1" component="h2">
                                                        ID
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant="subtitle1" component="h2">
                                                        Email
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography variant="subtitle1" component="h2">
                                                        Designation
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="subtitle1" component="h2">
                                                        Department
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                                <Accordion key={row.id} row={row}/>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={Reports.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )}
                </div>
            </Paper>
        </Grid>
    );
}

export default EmployeeReports;