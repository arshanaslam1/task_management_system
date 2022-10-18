import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import {Chip,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {useGetUsersQuery} from "../../api/dashboardapiSlice";
import {
    employee,
    selectAfterDate,
    selectBeforeDate,
    setCurrentMonth,
    setCurrentSevenDays,
    setDateTime,
    setEmployee,
    setLastMonth
} from "./dashSlice";
import {RequireManagerC} from "../../shared/permissions";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const FilterByDateTimeBetweenDialog=()=> {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const beforeDate = useSelector(selectBeforeDate);
    const afterDate = useSelector(selectAfterDate);
    const emp = useSelector(employee);
    const [afDate, setAfDate] = React.useState(new Date(afterDate));
    const [beDate, setBeDate] = React.useState(new Date(beforeDate));
    const [personName, setPersonName] = React.useState([]);
    const {data: UserListData, isLoading, isError} = useGetUsersQuery();

    const handleChange = (event) => {
        const {
            target: {value}
        } = event;
        setPersonName(
            // On autofill, we get a stringifies value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handle7days = () => {
        dispatch(setCurrentSevenDays());
        handleClose()
    };
    const handleCurrentMonth = () => {
        dispatch(setCurrentMonth());
        handleClose()
    };
    const lastMonth = () => {
        dispatch(setLastMonth());
        handleClose()
    };
    const datetime = () => {
        if (afterDate !== afDate.toISOString() || beforeDate !== beDate.toISOString()) {
            dispatch(setDateTime({afterDate: afDate.toISOString(), beforeDate: beDate.toISOString()}));
        }
        if (emp !== personName) {
            dispatch(setEmployee({personName}))
        }
        handleClose()
    }
    const handleAllDepartment = () => {
        dispatch(setEmployee({personName: []}))
        handleClose()
    }

    return (
        <div>
            <div>
                <Button variant="outlined" startIcon={<EditIcon/>} onClick={handleClickOpen}>
                    Edit
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle align="center">Filter by DateTime</DialogTitle>

                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={3}>
                            <Chip label="Last 7 Days" variant="outlined" onClick={handle7days}/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Chip label="Current Month" variant="outlined" onClick={handleCurrentMonth}/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Chip label="Last Month" variant="outlined" onClick={lastMonth}/>
                        </Grid>
                        <RequireManagerC>
                            <Grid item xs={12} sm={3}>
                                <Chip label="All Department" variant="outlined" onClick={handleAllDepartment}/>
                            </Grid>
                        </RequireManagerC>
                        <Grid item xs={8} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="After DateTime"
                                    value={afDate}
                                    onChange={(newValue) => {
                                        setAfDate(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Before DateTime"
                                    value={beDate}
                                    onChange={(newValue) => {
                                        setBeDate(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <RequireManagerC>
                            <Grid item xs={12} sm={6}>
                                <div>
                                    <FormControl sx={{m: 1, width: 300}}>
                                        <InputLabel id="demo-multiple-checkbox-label">Select Employees</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={personName}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="Select Employees"/>}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {isLoading || isError ?
                                                null
                                                :
                                                UserListData.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        <Checkbox checked={personName.indexOf(option.id) > -1}/>
                                                        <ListItemText>
                                                            <Grid item xs={12} sm={10}>
                                                                <Grid item xs={8}
                                                                      sm={2}>{`${option.id} : ${option.first_name} ${option.last_name}`}</Grid>
                                                            </Grid>
                                                        </ListItemText>
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                        </RequireManagerC>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={datetime}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FilterByDateTimeBetweenDialog;
