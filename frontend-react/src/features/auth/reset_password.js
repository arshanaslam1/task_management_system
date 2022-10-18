import React, {useEffect, useState} from 'react';
import {Link as RLink} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {Alert} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {routesConfig} from "../../config/RouteConfig";


const validationSchema =  Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
});

const ResetPassword=()=> {
    const [status, setStatus] = useState("");
    const result = "";

    const formik = useFormik({
        initialValues: {
            email: '',
        },

        validationSchema: validationSchema,

        onSubmit: (values) => {
            alert("not configured", values)
            //navigate('/')
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
                    Reset Password
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{mt: 3}}>
                    {(status["isSuccess"]) && <Alert severity="success">Reset request has successfully processed !</Alert> }
                    {(status["isError"] && (status.error.data.non_field_errors)) && <Alert severity="error">{status.error.data.non_field_errors}</Alert>}
                    {(status["isError"]) && <Alert severity="error">There is an internal error</Alert>}
                    <Grid container spacing={2}>
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
                    </Grid>
                    <LoadingButton
                        loading={status['isLoading']}
                        disabled={status['isLoading']}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        reset
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RLink} variant="body2" to={`../${routesConfig.LOGIN}`}>
                                {"Already have an account? Sign in"}
                            </Link>
                        </Grid>
                        <Grid item>
                                <Link component={RLink} variant="body2" to={`../${routesConfig.REGISTER}`}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default ResetPassword;
