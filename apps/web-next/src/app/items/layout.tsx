import * as React from 'react';
import Box from '@mui/material/Box';


import { AppNavBar } from '@/components/AppNavBar';


export default function PageLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <React.Fragment>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100%'}}>
        <AppNavBar/>
        {children}
      </Box>
    </React.Fragment>
  );
}
