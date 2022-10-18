import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {Link as RLink, useNavigate} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Alert} from "@mui/material";
import {useLoginMutation} from "../../api/authApiSlice";
import {routesConfig} from "../../config/RouteConfig";
import FormControl from "@mui/material/FormControl";


const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    rememberMe: Yup.bool(),
});

const Login=()=> {
    const [login, result] = useLoginMutation();
    const [status, setStatus] = useState("");
    const [credentials, SetCredentials] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem("credentials"))
        SetCredentials ( credential? credential :
            {
                email: "",
                password: "",
                rememberMe: false,
            }
        );
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: `${credentials.email}`,
            password: `${credentials.password}`,
            rememberMe: credentials.rememberMe,
        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            await login(values).unwrap();
            values.rememberMe?
                localStorage.setItem("credentials", JSON.stringify(values)): localStorage.setItem("credentials", JSON.stringify(null));
            navigate('/dashboard');
        }
    });


    useEffect(() => {
        setStatus(result);
    }, [result]);

    return (
        <Container component="main" maxWidth="xs">
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
                    Sign in
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{mt: 1}}>
                    {(status["isSuccess"]) && <Alert severity="success">You are successfully logged in!</Alert> }
                    {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">Unable to log in with provided credentials</Alert>}
                    {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={(formik.touched.email && Boolean(formik.errors.email)) || status["isError"]}
                        helperText={formik.touched.email && formik.errors.email}

                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={(formik.touched.password && Boolean(formik.errors.password)) || status["isError"]}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={() => formik.setFieldValue('rememberMe', !formik.values.rememberMe)}
                                    checked={formik.values.rememberMe}
                                    value={formik.values.rememberMe}
                                    color="primary"
                                    name="rememberMe"/>}
                            label="Remember me"
                        />
                    </FormControl>
                    <LoadingButton

                        loading={status['isLoading']}
                        disabled={status['isLoading']}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link variant="body2" to={`../${routesConfig.PASSWORD_RESET}`} component={RLink}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link variant="body2" to={`../${routesConfig.REGISTER}`} component={RLink}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
