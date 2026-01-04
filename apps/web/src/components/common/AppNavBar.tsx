

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, SignInButton, UserButton} from '@clerk/clerk-react';


import { AppBarHeight } from '@/lib/model/appNavBarModel';



export default function AppNavBar() {
  const theme: {} = useTheme();
  const drawerinfo: { name: string, href: string, tip: string }[] = [
    { name: 'Listah', href: '/', tip: 'Go to Listah home' },
    { name: 'Items', href: '/items/', tip: 'View all items' },
    { name: 'Tags', href: '/tags/', tip: 'View all tags' },
    { name: 'Categories', href: '/categories/', tip: 'View all categories' },
    { name: 'Settings', href: '/settings/', tip: 'View app settings' },
  ];

  return (
    <AppBar position="static"
        sx={{
          bgcolor: theme.palette.nav.main,
          width: '100%', height: AppBarHeight,
        }}
      elevation={0}
      >
      <Toolbar>
        <Box sx={{
          justifyContent: 'space-between',
          display: 'flex', width: '100%',
        }}>
          {
            drawerinfo.map((item) => (
              <Tooltip key={item.name} title={item.tip}>
                <Link
                  underline="hover"
                  key={item.name} href={item.href}
                  style={{ color: theme.palette.primary.contrastText, }}>
                  <Typography variant="h6" noWrap component="div"> {item.name}</Typography>
                </Link>
              </Tooltip>
            ))
          }
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

    // <AppBar
    //     sx={{
    //       // bgcolor: theme.palette.primary.main,
    //       width: '100%', height: AppBarHeight,
    //     }}>
    //   <Toolbar>
    //       <Box  sx={{
    //               justifyContent: 'space-between',
    //               display: 'flex', width: '100%',
    //             }}>
    //         {
    //           drawerinfo.map((item) => (
    //             <Tooltip key={item.name} title={item.tip}>
    //               <Link
    //                 underline="hover"
    //                 key={item.name} href={item.href}
    //                 style={{ color: theme.palette.primary.contrastText, }}>
    //                 <Typography variant="h6" noWrap component="div"> {item.name}</Typography>
    //               </Link>
    //             </Tooltip>
    //           ))
    //         }
    //       </Box>
    //   </Toolbar>
    // </AppBar>
  );
}
