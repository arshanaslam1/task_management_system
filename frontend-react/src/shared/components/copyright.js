import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Copyright = () => {
    return (
        <Typography
            variant="body1"
            align="center"
            color="text.primary"
            gutterBottom
        >
            {'Copyright © '}
            <Link color="inherit" href="https://ignicube.com/">
                Ignicube
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
export default Copyright;
