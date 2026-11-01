import { Fragment } from "react";
import { SignInButton } from '@clerk/react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';


import { AppContainer } from '@/components/layout/AppContainer';

export function Landing() {
  return (
    <Fragment>
      <AppContainer mw="md">
        <Paper variant="hero">
          <Typography variant="h1">Simplify your life.</Typography>
          <Typography variant="h5"> Manage different kinds of lists all in one place.</Typography>
          <SignInButton mode="modal">
            {/* @ts-ignore */}
            <Button variant='heroContained' color="inherit">
              <Typography variant="h6"> Get Started - It's free! </Typography>
            </Button>
          </SignInButton>
        </Paper>
      </AppContainer>
    </Fragment>
  )
}
