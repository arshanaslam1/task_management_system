import * as React from 'react';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {RequireUnAuthC} from "../shared/permissions";
import {routesConfig} from "../config/RouteConfig";

const Home =()=> {
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
                IgniCube
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                Something short and leading about the collection below—its contents,
                the creator, etc. Make it short and sweet, but not too short so folks
                don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
                sx={{pt: 4}}
                direction="row"
                spacing={2}
                justifyContent="center"
            >
                <RequireUnAuthC>
                    <Button variant="contained" onClick={() => navigate(routesConfig.LOGIN)}>Login</Button>
                    <Button variant="outlined" onClick={() => navigate(routesConfig.REGISTER)}>Register</Button>
                </RequireUnAuthC>
            </Stack>
        </Container>
    );
}
export default Home;
