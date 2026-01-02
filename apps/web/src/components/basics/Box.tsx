
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';


export function SpaceBetweenBox( props ) {
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


export function FlexEndBox( props ) {
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

export function FlexStartBox( props ) {
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


export function SpaceAroundBox( props) {
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


export function CentredBox( props ) {
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

export function RowGridBox( props ) {
  return (
    <Box sx={{ ...props.sx, display: 'grid', gridTemplateRows: `repeat(${props.numChildren}, 1fr)` }}>
     {props.children}
    </Box>
  );
}
export function ColumnGridBox( props ) {
  return (
    <Box sx={{ ...props.sx, display: 'grid', gridTemplateColumns: `repeat(${props.numChildren}, 1fr)` }}>
     {props.children}
    </Box>
  );
}
