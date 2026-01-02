import {
  Fragment
} from 'react';
import type {
  ReactNode
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import { CentredBox } from '@/components/basics/Box';



export function MainContainer({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <Container maxWidth="xl" >
        {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} > */}
        <Box sx={{
            height: '90vh'
            // bgcolor: '#cfe8fc',
          }} >
          {children}
        </Box>
      </Container>
    </Fragment>
  );
}


export function HeroContainer({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <Container maxWidth="sm" sx={{
            height: '100vh', justifyContent: 'center', alignContent: 'center', display: 'flex', flexWrap: 'wrap',
            bgcolor: '#cfe8fc',
          }}>
        {/* <CentredBox sx={{ bgcolor: '#cfe8fc', height: '50vh' }} > */}
          {children}
        {/* </CentredBox> */}
      </Container>
    </Fragment>
  );
}
