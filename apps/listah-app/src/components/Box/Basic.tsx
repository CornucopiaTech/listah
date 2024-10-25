import Box from '@mui/material/Box';


export default function BasicBox(props) {
  return (
      <Box sx={props.style}> { props.children} </Box>
  );
}
