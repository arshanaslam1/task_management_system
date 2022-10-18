import * as React from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {RequireUnAuthC} from "../shared/permissions";


const NoPermit =()=> {
    const navigate = useNavigate();
    return (
        <Container maxWidth="sm" sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Sorry!!!
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                You have not any permissions Yet, Please contact your admin.
            </Typography>
            <Stack
                sx={{pt: 4}}
                direction="row"
                spacing={2}
                justifyContent="center"
            >
                <RequireUnAuthC>
                    <Button variant="contained" onClick={() => navigate("/login")}>Login</Button>
                    <Button variant="outlined" onClick={() => navigate("/register")}>Register</Button>
                </RequireUnAuthC>
            </Stack>
        </Container>
    );
}
export default NoPermit;
