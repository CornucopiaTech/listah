'use client'

import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';



import { AppBarHeight } from '@/lib/model/appNavBarModel';



export default function AppNavBar() {
  const theme: {} = useTheme();
  const drawerinfo: { name: string, href: string, tip: string }[] = [
    { name: 'Listah', href: '/', tip: 'Go to Listah home' },
    { name: 'Items', href: '/items/read', tip: 'View all items' },
    { name: 'Tags', href: '/tags/read', tip: 'View all tags' },
    { name: 'Categories', href: '/categories/read', tip: 'View all categories' },
    { name: 'Settings', href: '/settings', tip: 'View app settings' },
  ];

  return (
    <AppBar sx={{ bgcolor: theme.palette.primary.main, width: '100%', height: AppBarHeight,}}>
      <Toolbar>
          <Box  sx={{
                  justifyContent: 'space-between',
                  display: 'flex', width: '100%',
                }}>
            {
              drawerinfo.map((item) => (
                <Tooltip key={item.name} title={item.tip}>
                  <Link key={item.name} href={item.href}
                    style={{ color: theme.palette.primary.contrastText, }}>
                    <Typography variant="h6" noWrap component="div"> {item.name}</Typography>
                  </Link>
                </Tooltip>
              ))
            }

            {/* Profile */}
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
  );
}
