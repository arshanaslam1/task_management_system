import React,  {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Alert, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Container from "@mui/material/Container";
import {usePasswordChangeMutation,} from "../../api/authApiSlice";


const validationSchema = Yup.object({
    old_password: Yup.string()
        .min(4, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    new_password1: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    new_password2: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required')
        .oneOf([Yup.ref('new_password1'), null], 'Passwords must match'),
})

const PasswordChange=()=> {
    const [passwordChange, result] = usePasswordChangeMutation();
    const [status, setStatus] = useState("");


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            "old_password": "",
            "new_password1": "",
            "new_password2": "",
        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            await passwordChange(values).unwrap()
        }
    });


    useEffect(() => {
        setStatus(result);
    }, [result]);


    return (
        <Container component="main" maxWidth="xs">
            <Paper
                sx={{p: 2, display: 'flex', flexDirection: 'column', marginTop: 5}}>
                <Box component="form"
                     sx={{
                         marginTop: 2,
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                     }}
                >
                    <Typography component="h1" variant="h6">
                        Password Change
                    </Typography>


                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {(status["isSuccess"]) && <Alert severity="success">Password Change successfully!</Alert> }
                            {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                            {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="old_password"
                                label="Old Password"
                                type="password"
                                id="old password"
                                autoComplete="current-password"
                                value={formik.values.old_password}
                                onChange={formik.handleChange}
                                error={(formik.touched.old_password && Boolean(formik.errors.old_password)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("old_password")) ? status.error.data.old_password[0] : formik.touched.old_password && formik.errors.old_password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="new_password1"
                                label="New Password"
                                type="password"
                                id="new password1"
                                autoComplete="new-password"
                                value={formik.values.new_password1}
                                onChange={formik.handleChange}
                                error={(formik.touched.new_password1 && Boolean(formik.errors.new_password1)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("new_password1")) ? status.error.data.new_password1[0] : formik.touched.new_password1 && formik.errors.new_password1}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="new_password2"
                                label="Confirm New Password"
                                type="password"
                                id="confirm_password"
                                autoComplete="new-password"
                                value={formik.values.new_password2}
                                onChange={formik.handleChange}
                                error={(formik.touched.new_password2 && Boolean(formik.errors.new_password2)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("new_password2")) ? status.error.data.new_password2[0] : formik.touched.new_password2 && formik.errors.new_password2}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" sx={{mt: 3}}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={formik.handleSubmit}
                        >
                            Change
                        </LoadingButton>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default PasswordChange;
