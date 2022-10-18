import React from "react";
import {Box, TableRow} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import PropTypes from "prop-types";

const Accordion=(props)=> {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.first_name} {row.last_name}
                </TableCell>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">{row.designation.title}</TableCell>
                <TableCell align="right">{row.department.title}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Report
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Upcoming Deadline</TableCell>
                                        <TableCell align="right">Pending</TableCell>
                                        <TableCell align="right">Complete</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">Worked Hours</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.assigned['Upcoming Deadline']}
                                        </TableCell>
                                        <TableCell align="right">{row.assigned['Pending Tasks']}</TableCell>
                                        <TableCell align="right">{row.assigned['Complete Tasks']}</TableCell>
                                        <TableCell align="right">
                                            {row.assigned['Total Tasks']}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.assigned['Worked Hours']}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Accordion.propTypes = {
    row: PropTypes.shape({
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        designation:
        PropTypes.shape({
                title: PropTypes.string,
            },
        ).isRequired,
        department:
        PropTypes.shape({
                title: PropTypes.string,
            },
        ).isRequired,
        assigned:
        PropTypes.shape({
                'Worked Hours': PropTypes.number.isRequired,
                'Pending Tasks': PropTypes.number.isRequired,
                'Complete Tasks': PropTypes.number.isRequired,
                'Total Tasks': PropTypes.number.isRequired,
                'Upcoming Deadline': PropTypes.number.isRequired,
            },
        ).isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default Accordion;