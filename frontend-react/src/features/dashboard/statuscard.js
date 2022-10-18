import React from 'react';
import Typography from '@mui/material/Typography';
import {Grid, Paper} from "@mui/material";
import Title from '../../shared/components/Title';


const StatusCard=(props)=> {
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
                </Paper>
            </Grid>
        </React.Fragment>
    );
}

export default StatusCard;
