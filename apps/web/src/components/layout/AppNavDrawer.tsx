import type {
  ReactNode
} from 'react';
import {
  Fragment,
  useState,
} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoginIcon from '@mui/icons-material/Login';
import CategoryIcon from '@mui/icons-material/Category';
import TagIcon from '@mui/icons-material/Tag';
import { useLocation } from '@tanstack/react-router';
import {
  Show, SignInButton, UserButton,
} from '@clerk/react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



import type { AppTheme } from '@/system/theme';
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {
  AppDrawerWidth,
} from '@/helpers/defaults';
import {
  AppTooltip,
  AppItemSearchBar,
  // AppBar,
  Drawer,
  // DrawerHeader,
} from "@/components/";






export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));




export function UnrespAppNavDrawer() {
  const theme = useTheme();
  const storeDrawerOpen = useAppStore((state) => state.drawerOpen);
  const storeSetDrawerOpen = useAppStore((state) => state.setDrawer);

  const handleDrawerOpen = () => storeSetDrawerOpen(true);
  const handleDrawerClose = () => storeSetDrawerOpen(false);
  const appbarWidth = storeDrawerOpen ? `calc(100% - ${AppDrawerWidth}px)` : "100%";

  console.info({ storeDrawerOpen });
  const altIconStyle = { color: theme.palette.primary.dark };
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  function checkActive(val: string) {
    return pathname.includes(val)
  }

  function iconStyling(url: string) {
    const isActive = checkActive(url);
    return {
      display: 'block',
      // backgroundColor:
      // color: theme.palette.primary.contrastText,
      color: isActive ? theme.palette.primary.light : theme.palette.primary.main,
    }
  }
  const drawerTextStyling = { color: theme.palette.primary.main };
  const iconList = [
    {
      icon: <TagIcon sx={altIconStyle} />,
      name: "Tags",
      url: "/tags"
    },
    {
      icon: <CategoryIcon sx={altIconStyle} />,
      name: "Filters",
      url: "/filters"
    },
  ];


  return (
    <Fragment >
      <AppBar position="fixed" sx={{ bgcolor: theme.palette.background.default, color: theme.palette.primary.main, width: "100%", }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} onClick={handleDrawerOpen} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{}}>
            News
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider />
      <Drawer anchor="left" open={storeDrawerOpen}
      // onClose={handleDrawerClose}
      >
        <List key="nav">
          {iconList.map((t) => (
            <AppTooltip key={t.name + t.url} title={t.name} placement="right-start" arrow>
              <Link key={t.name + t.url} href={t.url} onClick={handleDrawerClose}>
                <ListItem key={t.name} disablePadding sx={iconStyling(t.url)}>
                  <ListItemButton >
                    <ListItemIcon > {t.icon} </ListItemIcon>
                    {/* @ts-ignore */}
                    <ListItemText primary={t.name} sx={drawerTextStyling} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </AppTooltip>
          ))}
        </List>

        <Divider key="divider" sx={{ borderColor: theme.palette.primary.contrastText }} />
        <List key="account">
          <Show when="signed-out" key="signout">
            <ListItem key="signin" disablePadding>
              <ListItemButton >
                <ListItemIcon  >
                  {/* @ts-expect-error valid style prop is not recognised */}
                  <SignInButton style={{ border: 'none' }}>
                    <LoginIcon />
                  </SignInButton>
                </ListItemIcon>
                {/* @ts-ignore */}
                <ListItemText primary="Login" sx={drawerTextStyling} />
              </ListItemButton>
            </ListItem>
          </Show>
          <Show when="signed-in" key="signin">
            <ListItem key="signed-in" disablePadding>
              <ListItemButton >
                <ListItemIcon  > <UserButton /> </ListItemIcon>
                {/* @ts-ignore */}
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </Show>
        </List>
      </Drawer>
    </Fragment>
  );
}


export function AppNavDrawer() {
  const theme = useTheme();
  const storeDrawerOpen = useAppStore((state) => state.drawerOpen);
  const storeSetDrawerOpen = useAppStore((state) => state.setDrawer);
  const toggleDrawerOpen = () => storeSetDrawerOpen(!storeDrawerOpen);
  const handleDrawerOpen = () => storeSetDrawerOpen(true);
  const handleDrawerClose = () => storeSetDrawerOpen(false);

  console.info({ storeDrawerOpen });

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerClose}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Fragment>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawerOpen}
            sx={{ mr: 2 }}
          // sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" >
            Listah
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={storeDrawerOpen} onClose={handleDrawerClose}>
        <Typography variant="h1" color="secondary"> In Drawer</Typography>
        {DrawerList}
      </Drawer>
    </Fragment>
  );
}
