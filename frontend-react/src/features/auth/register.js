import React,  {useEffect, useState} from 'react';
import {Link as RLink, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import {Alert, FormHelperText} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import {useRegisterMutation} from "../../api/authApiSlice";
import {routesConfig} from "../../config/RouteConfig";


const validationSchema = Yup.object({
    first_name: Yup.string().min(5, 'Must be 4 characters or more').max(10, 'Must be 10 characters or less').required('Required'),
    last_name: Yup.string().min(4, 'Must be 4 characters or more').max(10, 'Must be 10 characters or less').required('Required'),
    username: Yup.string().min(4, 'Must be 4 characters or more').max(20, 'Must be 20 characters or less').required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password1: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    password2: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required')
        .oneOf([Yup.ref('password1'), null], 'Passwords must match'),
    termsAndConditions: Yup
        .bool()
        .oneOf([true], 'You need to accept the terms and conditions'),
});

const Register=()=> {
    const [register, result] = useRegisterMutation();
    const [status, setStatus] = useState("");
    let navigate = useNavigate();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password1: '',
            password2: '',
            termsAndConditions: false,
        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            await register(values).unwrap()
            sleep(10000).then(() => {
                navigate('/dashboard')
            });
        }
    });

    useEffect(() => {
        setStatus(result);
    }, [result]);


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" Validate onSubmit={formik.handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {(status["isSuccess"]) && <Alert severity="success">You are successfully logged in!</Alert> }
                            {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                            {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="first_name"
                                required
                                fullWidth
                                id="first_name"
                                label="First Name"
                                autoFocus
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
                                id="last_name"
                                label="Last Name"
                                name="last_name"
                                autoComplete="family-name"
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                error={(formik.touched.last_name && Boolean(formik.errors.last_name)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("last_name")) ? status.error.data.last_name[0] : formik.touched.last_name && formik.errors.last_name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                error={(formik.touched.username && Boolean(formik.errors.username)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("username")) ? status.error.data.username[0] : formik.touched.username && formik.errors.username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={(formik.touched.email && Boolean(formik.errors.email)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("email")) ? status.error.data.email[0] : formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password1"
                                label="New Password"
                                type="password"
                                id="new password"
                                autoComplete="new-password"
                                value={formik.values.password1}
                                onChange={formik.handleChange}
                                error={(formik.touched.password1 && Boolean(formik.errors.password1)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("password1")) ? status.error.data.password1[0] : formik.touched.password1 && formik.errors.password1}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password2"
                                label="Confirm New Password"
                                type="password"
                                id="confirm_password"
                                autoComplete="repeat-password"
                                value={formik.values.password2}
                                onChange={formik.handleChange}
                                error={(formik.touched.password2 && Boolean(formik.errors.password2)) || status["isError"]}
                                helperText={(status.isError && status.error.data.hasOwnProperty("password2")) ? status.error.data.password2[0] : formik.touched.password2 && formik.errors.password2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                required
                                error={(formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions))}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={() => formik.setFieldValue('termsAndConditions', !formik.values.termsAndConditions)}
                                            checked={formik.values.termsAndConditions}
                                            value={formik.values.termsAndConditions}
                                            color="primary"
                                            name="termsAndConditions"/>}
                                    label="I accept all terms and conditions."
                                />
                                {(formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions)) ?
                                    <FormHelperText>{formik.errors.termsAndConditions}</FormHelperText> : null}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <LoadingButton
                        loading={status['isLoading']}
                        disabled={status['isLoading']}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link variant="body2" to={`../${routesConfig.LOGIN}`} component={RLink}>
                                Already have an account? Login
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;
