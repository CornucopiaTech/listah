
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';


export function SpaceBetweenBox(props): ReactNode {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'space-between', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {props.children}
    </Box>
  );
}


export function FlexEndBox(props): ReactNode {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'flex-end', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {props.children}
    </Box>
  );
}

export function FlexStartBox(props): ReactNode {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'flex-start', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {props.children}
    </Box>
  );
}


export function SpaceAroundBox(props): ReactNode {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'space-around', alignContent: 'center',
        display: 'flex', width: '100%',
      }}>
      {props.children}
    </Box>
  );
}


export function CentredBox(props): ReactNode {
  return (
    <Box
      sx={{
        ...props.sx,
        justifyContent: 'center', alignContent: 'center',
        display: 'flex', width: '100%', flexWrap: 'wrap',
      }}>
      {props.children}
    </Box>
  );
}

export function RowGridBox(props): ReactNode {
  return (
    <Box sx={{ ...props.sx, display: 'grid', gridTemplateRows: `repeat(${props.numChildren}, 1fr)` }}>
     {props.children}
    </Box>
  );
}
export function ColumnGridBox(props): ReactNode {
  return (
    <Box sx={{ ...props.sx, display: 'grid', gridTemplateColumns: `repeat(${props.numChildren}, 1fr)` }}>
     {props.children}
    </Box>
  );
}
