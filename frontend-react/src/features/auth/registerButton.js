import React from "react";
import Button from "@mui/material/Button";
import {NavLink} from "react-router-dom";
import {routesConfig} from "../../config/RouteConfig";

const RegisterButton = () => {
    return (<Button color="inherit" component={NavLink} to={routesConfig.REGISTER}>Register</Button>);
}

export default RegisterButton;
