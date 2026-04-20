
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import {
  Show, SignInButton, UserButton,
} from '@clerk/react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';


import {
  AppH5Typography,
} from "@/components/core/Typography";
import { AppBarHeight } from '@/lib/helper/defaults';
import type { AppTheme } from '@/lib/styles/theme';


export function AppNavBar() {
  const theme: AppTheme = useTheme();
  return (
    <AppBar position="static"
      sx={{
        width: '100%',
        height: AppBarHeight,
      }}
      elevation={1}
    >
      <Toolbar sx={{
        justifyContent: 'space-between', alignContent: 'center', alignItems: 'center',
        display: 'flex', flexWrap: 'wrap', width: '100%', p: "1%",
        bgcolor: theme.palette.background.default,
      }}>
        <Link underline="hover" key="home" href="/" >
          <AppH5Typography> Listah </AppH5Typography>
        </Link>
        <Show when="signed-out" key="signout">
          <SignInButton>
            <Button> <AppH5Typography > Sign In </AppH5Typography></Button>
          </SignInButton>
        </Show>

        <Show when="signed-in" key="signin">
          <UserButton />
        </Show>
      </Toolbar>
    </AppBar>
  );
}
