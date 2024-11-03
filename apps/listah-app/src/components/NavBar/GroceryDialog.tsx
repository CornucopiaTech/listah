'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


export default function ResponsiveDialog() {
  const [openGrocery, setOpenGrocery] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  export const handleClickOpenGrocery = () => {
    setOpenGrocery(true);
  };

  export const handleCloseGrocery = () => {
    setOpenGrocery(false);
  };


  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpenGrocery}>
        Open responsive dialog
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={openGrocery}
        onClose={handleCloseGrocery}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseGrocery}>
            Disagree
          </Button>
          <Button onClick={handleCloseGrocery} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
