import * as React from 'react';
import {
  Box,
  TextField
} from '@mui/material';

export default function ItemsSearch() {
  return (
    // <Box
    //     component="form"
    //     sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }}
    //     noValidate
    //     autoComplete="off"
    //     >
    <Box sx={{ width: '60%', mx: 4 }}>
      <TextField id="outlined-basic" label="Search for item" variant="outlined" color="secondary" margin="dense" fullWidth/>
    </Box>

    //   {/* <TextField id="filled-basic" label="Search" variant="filled"  defaultValue="Search for item"/> */}
    //   {/* <TextField id="standard-basic" label="Search for item" variant="standard" /> */}
    // {/* </Box> */}
  );
}
