import React from 'react';
import {NavLink} from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import TaskIcon from '@mui/icons-material/Task';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreateTaskDialog from "./createdialog";
import {RequireManagerC} from "../../shared/permissions";
import {routesConfig} from "../../config/RouteConfig";


const MainListItems=()=> {
    return (
        <React.Fragment>
            <ListItemButton
                component={NavLink}
                to={`./${routesConfig.DASHBOARD}`}
            >
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>
            <CreateTaskDialog/>
            <ListItemButton
                component={NavLink}
                to={`./${routesConfig.DASHBOARD}/${routesConfig.TASKS}`}
            >
                <ListItemIcon>
                    <TaskIcon/>
                </ListItemIcon>
                <ListItemText primary="Tasks"/>
            </ListItemButton>
            <RequireManagerC>
                <ListItemButton
                    component={NavLink}
                    to={`./${routesConfig.DASHBOARD}/${routesConfig.REPORTS}`}
                >
                    <ListItemIcon>
                        <BarChartIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Reports"/>
                </ListItemButton>
            </RequireManagerC>
        </React.Fragment>
    );
}

export default MainListItems;
