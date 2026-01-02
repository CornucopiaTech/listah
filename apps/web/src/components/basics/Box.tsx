
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';


export function SpaceBetweenBox( props, { children }: { children:ReactNode } ) {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'space-between', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {children}
    </Box>
  );
}


export function SpaceAroundBox( props, { children }: { children:ReactNode } ) {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'space-around', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {children}
    </Box>
  );
}


export function CentredBox( props ) {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'center', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {props.children}
    </Box>
  );
}
