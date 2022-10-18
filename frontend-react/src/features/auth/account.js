import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Alert, Backdrop, CircularProgress, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import {useUpdateUserAccountInfoMutation, useUserAccountInfoQuery} from "../../api/authApiSlice";


const initialFormState = {

    "pk": "",
    "username": "",
    "email": "",
    "first_name": "",
    "last_name": "",
    "department": {
        "title": ""
    },
    "designation": {
        "title": "",
    }
};

const validationSchema = Yup.object({
    first_name: Yup.string().min(4, 'Must be 4 characters or more').max(10, 'Must be 10 characters or less').required('Required'),
    last_name: Yup.string().min(4, 'Must be 4 characters or more').max(10, 'Must be 10 characters or less').required('Required'),
});

const Account=()=> {
    const {data: userAccountInfo, isLoading, isSuccess, isError} = useUserAccountInfoQuery();
    const [updateUserAccountInfo, result] = useUpdateUserAccountInfoMutation();
    const [formData, setFormData] = useState(initialFormState);
    const [status, setStatus] = useState("");
    const [editMode, setEditMode] = useState(false);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            "first_name": formData.first_name,
            "last_name": formData.last_name,
        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            await updateUserAccountInfo(values).unwrap()

            setEditMode(false);
        }
    });

    const handleEdit = () => {
        setEditMode(true);
    };

    useEffect(() => {
        setStatus(result);
    }, [result]);

    useEffect(
        () => {
            if (isSuccess)
                setFormData(userAccountInfo)
        },
        [userAccountInfo, isSuccess]);


    return (
        <Grid item xs={12}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column',}}>
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

                            <Box
                                sx={{
                                    marginTop: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    User Account
                                </Typography>


                                <Grid container spacing={2} sx={{mt: 3}}>
                                    <Grid item xs={12}>
                                        {(status["isSuccess"]) && <Alert severity="success">You are registered successfully!</Alert> }
                                        {(status["isError"] && (status.error.data.hasOwnProperty("non_field_errors"))) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            fullWidth
                                            label="User ID"
                                            value={formData.pk}
                                            disabled
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="first_name"
                                            required
                                            fullWidth
                                            label="First Name"
                                            autoFocus
                                            InputProps={{
                                                readOnly: !editMode,
                                            }}
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            error={(formik.touched.first_name && Boolean(formik.errors.first_name)) || status["isError"]}
                                            helperText={(status.isError && status.error.data.hasOwnProperty("first_name")) ? status.error.data.first_name[0] : formik.touched.first_name && formik.errors.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Last Name"
                                            name="last_name"
                                            InputProps={{
                                                readOnly: !editMode,
                                            }}
                                            autoComplete="family-name"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            error={(formik.touched.last_name && Boolean(formik.errors.last_name)) || status["isError"]}
                                            helperText={(status.isError && status.error.data.hasOwnProperty("last_name")) ? status.error.data.last_name[0] : formik.touched.last_name && formik.errors.last_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoComplete="username"
                                            disabled
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={formData.hasOwnProperty("username") ? formData.username : ""}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField

                                            value={formData.email}
                                            fullWidth
                                            disabled
                                            label="Email Address"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            value={formData.hasOwnProperty("department") ? formData.department.title : ""}
                                            fullWidth
                                            disabled
                                            name="department"
                                            label="Department"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            value={formData.hasOwnProperty("designation") ? formData.designation.title : ""}
                                            fullWidth
                                            disabled
                                            name="designation"
                                            label="Designation"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="flex-end" sx={{mt: 3}}>
                                    <LoadingButton
                                        variant="contained"
                                        color="secondary"
                                        type="submit"
                                        onClick={editMode? formik.handleSubmit: handleEdit}
                                    >
                                        {editMode? "Update": "Edit"}
                                    </LoadingButton>
                                </Grid>
                            </Box>
                        )
                }
            </Paper>
        </Grid>
    );
}

export default Account;
