import * as React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const DownloadInProgress = () => {
  return (
    <Box sx={{ height: '100vh' }} bgcolor="white" p={4}>
      <LinearProgress />
      <Typography component="p" variant="h4" textAlign="center" marginTop={2}>
        Download in progress...
      </Typography>
    </Box>
  );
};

export default DownloadInProgress;
