import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loading() {
    return (
        <div style={{ backgroundColor: '#0b1539', width: '100%', height: '100vh' }}>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </div>
    );
}
