

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react';
import { Icon } from "@iconify/react";
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';


import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import type { AppTheme } from '@/lib/styles/theme';



export default function AppNavBar() {
  const theme: AppTheme = useTheme();
  return (
    <AppBar position="static"
        sx={{
          bgcolor: theme.palette.primary.light,
          width: '100%', height: AppBarHeight, //p:0, m:0,
        }}
      elevation={1}
      >
      <Toolbar sx={{
        justifyContent: 'space-between', alignContent: 'center', alignItems: 'center',
        display: 'flex', flexWrap: 'wrap', width: '100%', p: "1%"
      }}>
        <Link
          underline="hover" key="home" href="/"
          sx={{ color: theme.palette.primary.contrastText, p: 0, m: 0, display: 'flex', alignItems: 'center', }}>

          <AppH5ButtonTypography>
            {/* <img src="/logo.png" width={42} height={50} /> */}
            Listah
          </AppH5ButtonTypography>
        </Link>

        <SignedOut>
          <SignInButton mode="modal">
            <Tooltip title="Log in to your account" placement="bottom">
              <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 40, height: 40, }} variant="rounded">
                <Icon icon="material-symbols:login-rounded" width="40" height="40" />
              </Avatar>
            </Tooltip>
            {/* <Typography variant="h6" noWrap component="div">
              Sign In
            </Typography> */}
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
