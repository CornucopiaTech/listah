
import {
  Fragment
} from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link,
  Tooltip
} from '@mui/material';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';


export const AppBarHeight = '80px'


export function AppNavBar() {
  return (
      <Fragment>
          <AppBar sx={{ width: '100%', height: AppBarHeight,}}>
            <Toolbar>
                {/* Listah */}
                <Box  sx={{
                            justifyContent: 'flex-start',
                            display: 'inline-flex', width: '20%',
                          }}>
                    <Link href="/" underline="hover"
                          style={{
                                  // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                                  color: "white",
                                }}>
                        <Typography variant="h6" noWrap component="div"> Listah</Typography>
                    </Link>
                </Box>

                {/* Items + Tags + Settings*/}
                <Box  sx={{
                            justifyContent: 'space-evenly',
                            display: 'inline-flex', ml: 6, width: '60%'
                          }}>
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

                </Box>

                {/* Profile */}
                <Box sx={{
                          justifyContent: 'space-around',
                          display: 'inline-flex',  width: '20%', px: 2
                        }}>
                    <SignedOut>
                      <Tooltip title="Sign in">
                        <Typography variant="h6" noWrap component="div">
                          <SignInButton />
                        </Typography>
                      </Tooltip>
                      <Tooltip title="Sign out">
                        <Typography variant="h6" noWrap component="div">
                          <SignUpButton />
                        </Typography>
                      </Tooltip>
                    </SignedOut>
                    <SignedIn>
                      <Tooltip title="View profile">
                        <UserButton />
                      </Tooltip>
                    </SignedIn>
                </Box>
            </Toolbar>
          </AppBar>

      </Fragment>
  );
}
