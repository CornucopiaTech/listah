
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


export const SpaceBetweenBox = styled(Box)(() => ({
  justifyContent: 'space-between', alignContent: 'center',
  display: 'flex',
}));

export const FlexEndBox = styled(Box)(() => ({
  justifyContent: 'flex-end', alignContent: 'center',
  display: 'flex', width: '100%',
}));

export const FlexStartBox = styled(Box)(() => ({
  justifyContent: 'flex-start', alignContent: 'center',
  display: 'flex', width: '100%',
}));

export const SpaceAroundBox = styled(Box)(() => ({
  justifyContent: 'space-around', alignContent: 'center',
  display: 'flex',
}));


export const CentredBox = styled(Box)(() => ({
  justifyContent: 'center', alignContent: 'center',
  display: 'flex', width: '100%', flexWrap: 'wrap',
}));


export const ItemFormTagBox = styled(Box)(() => ({
  '& legend': { fontSize: '1rem', color: 'rgba(0, 0, 0, 0.6)' },
  border: `0.5px solid`,
  borderColor: "rgba(0, 0, 0, 0.23)",
  margin: 0, borderRadius: 1,
  fontSize: '1rem',
  padding: '16.5px 14px', // Matches standard TextField padding
  transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    // Standard MUI hover border color
    borderColor: 'rgba(0, 0, 0, 0.87)',
  },
  '&:focus-within': {
    // Matches the "active" blue focus state
    border: '2px solid',
    borderColor: 'primary.main',
    // Adjust padding to prevent "jumping" when border thickness changes
    padding: '15.5px 13px',
  },
}));


export const ItemFormSpeedDialBox = styled(Box)(() => ({
  height: '5vh', transform: 'translateZ(0px)', flexGrow: 1
}));
