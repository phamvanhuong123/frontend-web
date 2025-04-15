import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestMui = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Xin chào MUI ✨
      </Typography>
      <Button variant="contained" color="primary">
        Bấm thử nè
      </Button>
    </Box>
  );
};

export default TestMui;
