'use client'

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton
} from '@clerk/react-router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';


export const AppBarHeight = '80px'


export function AppNavBar() {
  const theme: any = useTheme();
  return (
    <AppBar sx={{ bgcolor: theme.palette.primary.main, width: '100%', height: AppBarHeight,}}>
      <Toolbar>
          <Box  sx={{
                      justifyContent: 'space-between',
                      display: 'flex', width: '100%',
                    }}>
            {/* Listah */}
            <Link href="/" underline="hover"
                  style={{
                          // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                          color: "white",
                        }}>
                <Typography variant="h6" noWrap component="div"> Listah</Typography>
            </Link>

            {/* Items + Tags + Settings*/}
            <Tooltip title="View all items">
              <Link href="/items" underline="hover"
                    style={{
                            // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                            color: "white",
                          }}>
                  <Typography variant="h6" noWrap component="div"> Items</Typography>
              </Link>
            </Tooltip>
            <Tooltip title="View all tags">
              <Link href="/items" underline="hover"
                    style={{
                            // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                            color: "white",
                          }}>
                  <Typography variant="h6" noWrap component="div"> Tags</Typography>
              </Link>
            </Tooltip>
            <Tooltip title="View app settings">
              <Link href="/settings" underline="hover"
                    style={{
                            // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                            color: "white",
                          }}>
                  <Typography variant="h6" noWrap component="div"> Settings</Typography>
              </Link>
            </Tooltip>
            {/* Profile */}
            {/*
              <SignedOut>
                <Tooltip title="Sign in">
                  <Typography variant="h6" noWrap component="div">
                    <SignInButton />
                  </Typography>
                </Tooltip>
              </SignedOut>
              <SignedIn>
                <Tooltip title="View profile">
                  <UserButton />
                </Tooltip>
              </SignedIn>
            */}
          </Box>
      </Toolbar>
    </AppBar>
  );
}
