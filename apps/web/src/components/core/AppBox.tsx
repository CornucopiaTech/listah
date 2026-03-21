
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';


export function SpaceBetweenBox({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
  return (
    <Box
      sx={{
        ...sx,
        justifyContent: 'space-between', alignContent: 'center',
        display: 'flex',
        // width: '100%',
      }}>
      {children}
    </Box>
  );
}


export function FlexEndBox({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
  return (
    <Box
      sx={{
        ...sx,
        justifyContent: 'flex-end', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {children}
    </Box>
  );
}

export function FlexStartBox({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
  return (
    <Box
      sx={{
        ...sx,
        justifyContent: 'flex-start', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {children}
    </Box>
  );
}


export function SpaceAroundBox({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
  return (
    <Box
      sx={{
        ...sx,
        justifyContent: 'space-around', alignContent: 'center',
        display: 'flex',
        // width: '100%',
      }}>
      {children}
    </Box>
  );
}


export function CentredBox({ children, sx }: { children: ReactNode, sx?: any }): ReactNode {
  return (
    <Box
      sx={{
        ...sx,
        justifyContent: 'center', alignContent: 'center',
        display: 'flex', width: '100%', flexWrap: 'wrap',
      }}>
      {children}
    </Box>
  );
}
