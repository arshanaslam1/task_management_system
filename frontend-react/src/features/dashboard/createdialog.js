import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListItemButton from "@mui/material/ListItemButton";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Grid';
import {Alert, FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {useAddTaskMutation, useGetUsersQuery} from "../../api/dashboardapiSlice";
import {RequireManagerC} from "../../shared/permissions";


const validationSchema = Yup.object({
    title: Yup.string().min(10, 'Must be 10 characters or more').max(50, 'Must be 50 characters or less').required('Required'),
    body: Yup.string().min(20, 'Must be 20 characters or more').max(200, 'Must be 200 characters or less').required('Required'),
    start_time: Yup.date().min(new Date(), "Cannot Select the past date time").required("Required").typeError("Please Select Valid DateTime!"),
    end_time: Yup.date().min(Yup.ref("start_time"), "To Date cannot be before From Start Date")
        .required("Required").typeError("Please Select Valid DateTime!"),
    assigned: Yup.string(),
});

const CreateTaskDialog=()=> {
    const [open, setOpen] = React.useState(false);
    const [addTask, result] = useAddTaskMutation();
    const {data: UserListData, isLoading, isError} = useGetUsersQuery();
    const [status, setStatus] = useState("");


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            body: '',
            start_time: '',
            end_time: '',
            assigned: '',
        },

        validationSchema: validationSchema,

        onSubmit: async (values, actions) => {
            ///handleClose();
            await addTask(values).unwrap();
            sleep(1000).then(() => {
                handleClose()
            });
            setStatus("")
            actions.resetForm({
                    values: {
                        // the type of `values` inferred to be Blog
                        title: "",
                        body: "",
                        start_time: "",
                        end_time: "",
                        assigned: "",
                    },
                    // you can also set the other form states here
                }
            );
        }
    });

    useEffect(() => {
        setStatus(result);
    }, [result]);

    return (
        <div>
            <ListItemButton onClick={handleClickOpen}>
                <ListItemIcon>
                    <AddBoxIcon/>
                </ListItemIcon>
                <ListItemText>
                    Create
                </ListItemText>
            </ListItemButton>
            <Dialog open={open}>
                <DialogTitle align="center">Create Task</DialogTitle>
                <DialogContent component="form" validate="true">
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {(status["isSuccess"]) && <Alert severity="success">You created successfully!</Alert> }
                            {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                            {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                disabled
                                autoFocus
                                required
                                helperText="Project name is write here."
                                id="outlined-required"
                                label="Project"
                                multiline
                                rows={1}
                                fullWidth
                            />
                        </Grid>
                        <RequireManagerC>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth
                                             error={(formik.touched.assigned && Boolean(formik.errors.assigned)) || status["isError"]}
                                >
                                    <InputLabel id="demo-simple-select-label">Assign</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formik.values.assigned}
                                        label="Assign"
                                        onChange={(newValue) => {
                                            formik.setFieldValue('assigned', newValue.target.value
                                            );
                                        }}
                                    >
                                        {isLoading || isError ?
                                            null
                                            :
                                            UserListData.map((option) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.first_name} {option.last_name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                    <FormHelperText>{(status.isError && status.error.data.hasOwnProperty("assigned")) ? status.error.data.assigned[0] : (formik.touched.assigned && Boolean(formik.errors.assigned)) ? formik.touched.assigned && formik.errors.assigned : "Please select employee."}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </RequireManagerC>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                required
                                id="outlined-required"
                                label="Title"
                                multiline
                                rows={1}
                                fullWidth
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={(formik.touched.title && Boolean(formik.errors.title)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("title")) ? status.error.data.title[0] : (formik.touched.title && Boolean(formik.errors.title)) ? formik.touched.title && formik.errors.title : "Please write task title."}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                required
                                id="outlined-multiline-static"
                                label="Description"
                                multiline
                                rows={4}
                                fullWidth
                                name="body"
                                value={formik.values.body}
                                onChange={formik.handleChange}
                                error={(formik.touched.body && Boolean(formik.errors.body)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("body")) ? status.error.data.body[0] : (formik.touched.body && Boolean(formik.errors.body)) ? formik.touched.body && formik.errors.body : "Please write task title."}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    disablePast
                                    required
                                    label="Start DateTime"
                                    name='start_time'
                                    value={formik.values.start_time}
                                    onChange={(newValue) => {
                                        formik.setFieldValue('start_time', newValue);
                                    }}
                                    renderInput={(error) => <TextField size="small" {...error}
                                                                       error={(formik.touched.start_time && Boolean(formik.errors.start_time)) || status["isError"]}
                                                                       helperText={(status.isError && status.error.data.hasOwnProperty("start_time")) ? status.error.data.start_time[0] : (formik.touched.start_time && Boolean(formik.errors.start_time)) ? formik.touched.start_time && formik.errors.start_time : "Please Select end date and time."}
                                                                       sx={{width: '100%'}}/>}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker

                                    required
                                    label="End DateTime"
                                    value={formik.values.end_time}
                                    fullWidth
                                    name='end_time'
                                    minDate={formik.values.start_time}
                                    onChange={(newValue) => {
                                        formik.setFieldValue('end_time', newValue);
                                    }}

                                    renderInput={(error) => <TextField size="small" {...error}
                                                                       error={(formik.touched.end_time && Boolean(formik.errors.end_time)) || status["isError"]}
                                                                       helperText={(status.isError && status.error.data.hasOwnProperty("end_time")) ? status.error.data.end_time[0] : (formik.touched.end_time && Boolean(formik.errors.end_time)) ? formik.touched.end_time && formik.errors.end_time : "Please Select end date and time."}
                                                                       sx={{width: '100%'}}/>}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={formik.handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateTaskDialog;
