import React,  {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import {Alert, Box, CircularProgress, FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import {
    useDeleteTaskMutation,
    useGetTasksDetailQuery,
    useGetUsersQuery,
    useUpdateTaskMutation
} from "../../api/dashboardapiSlice";
import {RequireManagerC} from "../../shared/permissions";


const initialFormState = {
    title: '',
    body: '',
    start_time: '',
    end_time: '',
    assigned: '',
    owner: '',
    assigned_data: {'first_name': "", "last_name": ""},
    owner_data: {'first_name': "", "last_name": ""},
    id: '',
    created_on: '',
    updated_on: '',
    consumed_hours: '',
    status: '',
};

const validationSchema = Yup.object({
    title: Yup.string().min(10, 'Must be 10 characters or more').max(20, 'Must be 20 characters or less').required('Required'),
    body: Yup.string().min(20, 'Must be 20 characters or more').max(200, 'Must be 200 characters or less').required('Required'),
    end_time: Yup.date().required("Required").typeError("Please Select Valid DateTime!"),
    assigned: Yup.number().required("Required"),
    status: Yup.string().required("Required"),
});

const TaskViewDialog=(props)=> {
    const [formData, setFormData] = useState(initialFormState);
    const {data: TaskDetail, isLoading, isError, isUninitialized, isSuccess} = useGetTasksDetailQuery(props.id, {
        skip: !props.open,
    });
    const [deleteTask, {isLoading: isDeleting}] = useDeleteTaskMutation();
    const [updateTask, result] = useUpdateTaskMutation();
    const {data: UserListData} = useGetUsersQuery();
    const [status, setStatus] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(
        () => {
            if (isSuccess) {
                setFormData(TaskDetail)
            }
        },
        [TaskDetail, isSuccess]);

    useEffect(() => {
        setStatus(result);
    }, [result]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleClose = () => {
        props.handleCloseViewDialog();
        setStatus("");
        setEditMode(false);
    };

    const handleDelete = () => {
        handleClose();
        deleteTask(formData.id);
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: `${formData.title}`,
            body: `${formData.body}`,
            end_time: Date.parse(formData.end_time),
            assigned: `${formData.assigned}`,
            status: `${formData.status}`,
        },

        validationSchema: validationSchema,

        onSubmit: async (payload) => {
            await updateTask({id: formData.id, payload: payload}).unwrap();
            setEditMode(false);
        }
    });

    const StatusChoices = [
        {label: "PENDING", value: "pending"},
        {label: "COMPLETE", value: "complete"}
    ]


    return (

        <div>
            <Dialog open={props.open}>
                <DialogContent>
                    {(isLoading || isUninitialized) ?
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            style={{minHeight: '15vh'}}
                        >
                            <Grid item xs={3}>
                                <Box sx={{display: 'flex'}}>
                                    <CircularProgress/>
                                </Box>
                            </Grid>
                        </Grid>
                        :
                        (isError) ?
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                style={{minHeight: '15vh'}}
                            >
                                <Grid item xs={3}>
                                    <Box sx={{display: 'flex'}}>
                                        <CircularProgress/>
                                    </Box>
                                </Grid>
                            </Grid>
                            :
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    {(status["isSuccess"]) && <Alert severity="success">You Update successfully!</Alert> }
                                    {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                                    {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoFocus
                                        disabled
                                        id="outlined-required"
                                        label="Project"
                                        rows={1}
                                        fullWidth
                                        value=""
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <RequireManagerC>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth
                                                     error={(formik.touched.assigned && Boolean(formik.errors.assigned)) || status["isError"]}
                                        >
                                            <InputLabel id="demo-simple-select-label">Assigned</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                defaultValue={formData.assigned}
                                                value={formik.values.assigned}
                                                label="Assigned"
                                                onChange={(newValue) => {
                                                    formik.setFieldValue('assigned', newValue.target.value
                                                    );
                                                }}
                                                inputProps={{readOnly: !editMode}}
                                            >
                                                {UserListData ?
                                                    UserListData.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.first_name} {option.last_name}
                                                        </MenuItem>
                                                    )) :
                                                    null}
                                            </Select>
                                            <FormHelperText>{(status.isError && status.error.data.hasOwnProperty("assigned")) ? status.error.data.assigned[0] : (formik.touched.assigned && Boolean(formik.errors.assigned)) ? formik.touched.assigned && formik.errors.assigned : null}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </RequireManagerC>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        multiline
                                        rows={1}
                                        fullWidth
                                        inputProps={{readOnly: !editMode}}
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        error={(formik.touched.title && Boolean(formik.errors.title)) || status["isError"]}
                                        helperText={(status.isError && status.error.data.hasOwnProperty("title")) ? status.error.data.title[0] : (formik.touched.title && Boolean(formik.errors.title)) ? formik.touched.title && formik.errors.title : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        name='body'
                                        value={formik.values.body}
                                        onChange={formik.handleChange}
                                        error={(formik.touched.body && Boolean(formik.errors.body)) || status["isError"]}
                                        helperText={(status.isError && status.error.data.hasOwnProperty("body")) ? status.error.data.body[0] : (formik.touched.body && Boolean(formik.errors.body)) ? formik.touched.body && formik.errors.body : null}
                                        inputProps={{
                                            readOnly: !editMode
                                        }}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            disabled
                                            label="Start DateTime"
                                            onChange={() => {
                                            }}
                                            value={Date.parse(formData.start_time)}
                                            renderInput={(error) => <TextField size="small" {...error}
                                                                               sx={{width: '100%'}}/>}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            readOnly={!editMode}
                                            label="Deadline"
                                            fullWidth
                                            minDateTime={Date.parse(formData.start_time)}
                                            value={formik.values.end_time}
                                            name='end_time'
                                            onChange={(newValue) => {
                                                formik.setFieldValue('end_time', newValue);
                                            }}
                                            renderInput={(error) => <TextField size="small" {...error}
                                                                               error={(formik.touched.end_time && Boolean(formik.errors.end_time)) || status["isError"]}
                                                                               helperText={(status.isError && status.error.data.hasOwnProperty("end_time")) ? status.error.data.end_time[0] : (formik.touched.end_time && Boolean(formik.errors.end_time)) ? formik.touched.end_time && formik.errors.end_time : null}
                                                                               sx={{width: '100%'}}/>}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth
                                                 error={(formik.touched.status && Boolean(formik.errors.status)) || status["isError"]}
                                    >
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Status"
                                            value={formik.values.status}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('status', newValue.target.value
                                                );
                                            }}
                                            inputProps={{readOnly: !editMode}}
                                        >
                                            {
                                                StatusChoices.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                        <FormHelperText>{(status.isError && status.error.data.hasOwnProperty("status")) ? status.error.data.status[0] : (formik.touched.status && Boolean(formik.errors.status)) ? formik.touched.status && formik.errors.status : null}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        id="outlined-read-only-input"
                                        label="Consumed Hours"
                                        value={formData.consumed_hours}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            disabled
                                            label="Created"
                                            value={formData.created_on}
                                            onChange={() => {
                                            }}
                                            renderInput={(error) => <TextField size="small" {...error}
                                                                               sx={{width: '100%'}}/>}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            disabled
                                            label="Last Update"
                                            value={formData.updated_on}
                                            fullWidth
                                            onChange={() => {
                                            }}
                                            renderInput={(error) => <TextField size="small" {...error}
                                                                               sx={{width: '100%'}}/>}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        id="outlined-read-only-input"
                                        label="Task ID"
                                        value={formData.id}
                                        InputProps={{
                                            readOnly: !editMode,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        id="outlined-read-only-input"
                                        label="Owner"
                                        value={`${formData.owner_data.first_name} ${formData.owner_data.last_name}`}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                    }
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant="contained"
                        size="small"
                        color="warning"
                        loading={isDeleting}
                        onClick={handleDelete}
                    >
                        Delete
                    </LoadingButton>
                    {
                        editMode ?
                            <LoadingButton
                                variant="contained"
                                size="small"
                                color="secondary"
                                type="submit"
                                onClick={formik.handleSubmit}
                            >
                                Update
                            </LoadingButton>
                            :
                            <LoadingButton
                                variant="contained"
                                size="small"
                                color="secondary"
                                onClick={handleEdit}
                            >
                                Edit
                            </LoadingButton>
                    }

                    <LoadingButton
                        variant="contained"
                        size="small"
                        onClick={handleClose}
                    >
                        Close
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TaskViewDialog;
