import React from 'react';
import {useLocation} from "react-router-dom";
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {Grid, Paper} from "@mui/material";
import Title from '../../shared/components/Title';


const pathname = "/dashboard/tasks";

const StatusCardWithLink=(props)=> {
    const location = useLocation();
    const handleClick = () => {
        props.updateDataGridData(props.title)
    }

    return (
        <React.Fragment>
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <Title>{props.title.toUpperCase()}</Title>
                    <Typography color="text.secondary" sx={{flex: 1}}>

                    </Typography>
                    <Typography component="p" variant="h4" align={'center'}>
                        {props.count}
                    </Typography>
                    <Typography color="text.secondary" sx={{flex: 1}}>

                    </Typography>
                    {(location.pathname === pathname) ?
                        <div>
                            <Link color="primary" onClick={handleClick}>
                                View
                            </Link>
                        </div> :
                        null
                    }
                </Paper>
            </Grid>
        </React.Fragment>
    );
}

export default StatusCardWithLink;
