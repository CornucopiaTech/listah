

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react';


import { AppBarHeight } from '@/lib/model/appNavBarModel';
import type { AppTheme } from '@/lib/styles/theme';


export default function AppNavBar() {
  const theme: AppTheme = useTheme();
  return (
    <AppBar position="static"
        sx={{
          bgcolor: theme.palette.primary.light,
          width: '100%', height: [AppBarHeight], p:0, m:0,
        }}
      elevation={0}
      >
      <Toolbar>
        <Box sx={{
          justifyContent: 'space-between',
          display: 'flex', width: '100%',
        }}>
          <img src="/logo.png" width={60} height={60} />
          <SignedOut>
            <SignInButton mode="modal">
              <Typography variant="h6" noWrap component="div">
                Sign In
              </Typography>
              </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
      </AppBar>
  );
}
