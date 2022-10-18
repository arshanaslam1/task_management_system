import React from "react";
import Button from "@mui/material/Button";
import {NavLink} from "react-router-dom";
import {routesConfig} from "../../config/RouteConfig";

const LoginButton = () => {
    return (<Button color="inherit" component={NavLink} to={routesConfig.LOGIN}>Login</Button>);
}

export default LoginButton;