import type {
  ReactNode
} from 'react';
import {
  Fragment,
} from 'react';
import { useTheme, } from '@mui/material/styles';
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
import Stack from '@mui/material/Stack';
import LoginIcon from '@mui/icons-material/Login';
import CategoryIcon from '@mui/icons-material/Category';
import TagIcon from '@mui/icons-material/Tag';
import { useLocation } from '@tanstack/react-router';
import {
  Show, SignInButton, UserButton,
} from '@clerk/react';



import type { AppTheme } from '@/system/theme';
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  AppDrawerWidth,
} from '@/helpers/defaults';
import {
  AppTooltip,
  AppItemSearchBar,
  AppBar,
  Drawer,
  DrawerHeader,
} from "@/components/";



// ToDo: Define a search or a items page that the search bar will result in.

export function AppNavDrawer(): ReactNode {
  const theme: AppTheme = useTheme();
  const store: TAppStore = useAppStore((state) => state);
  const handleDrawerOpen = () => store.toggleDrawer(true);
  const handleDrawerClose = () => store.toggleDrawer(false);
  const altIconStyle = { color: theme.palette.primary.contrastText }
  const appbarWidth = store.drawerOpen ? `calc(100% - ${AppDrawerWidth}px)` : `calc(100% - calc(${theme.spacing(7)} + 1px))`;

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
      backgroundColor: isActive ? theme.palette.primary.light : theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }

  const drawerIconStyling = [
    { minWidth: 0, justifyContent: 'center', },
    store.drawerOpen ? { mr: 3, } : { mr: 'auto', },
  ];
  const drawerTextStyling = [store.drawerOpen ? { display: 1, } : { opacity: 0, },];
  const drawerButtonStyling = [
    { minHeight: 48, px: 2.5, },
    store.drawerOpen ? { justifyContent: 'initial', }
      : { justifyContent: 'center', },
  ];

  return (
    <Fragment>
      <AppBar
        position="fixed" open={store.drawerOpen} elevation={1}
        sx={{
          backgroundColor: theme.palette.background.default, width: appbarWidth,
          // height: AppBarHeight,
        }}>
        <Toolbar variant="dense" sx={{ minWidth: "100%", justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="primary" noWrap >
              Listah
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Stack direction="row" spacing={2}>
            <AppItemSearchBar />
            <Show when="signed-out" key="signout">
              {/* @ts-expect-error valid style prop is not recognised */}
              <SignInButton style={{ border: 'none' }}>
                <LoginIcon sx={altIconStyle} />
              </SignInButton>
            </Show>
            <Show when="signed-in" key="signin">
              <UserButton />
            </Show>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={store.drawerOpen} >
        <DrawerHeader>
          <IconButton >
            {
              store.drawerOpen ?
                <ChevronLeftIcon style={altIconStyle} onClick={handleDrawerClose} /> :
                <MenuIcon style={altIconStyle} onClick={handleDrawerOpen} />
            }
          </IconButton>
        </DrawerHeader>
        <List key="nav">
          {iconList.map((t) => (
            <AppTooltip key={t.name + t.url} title={t.name} placement="right-start" arrow>
              <Link key={t.name + t.url} href={t.url} onClick={() => store.toggleDrawer(false)}>
                <ListItem key={t.name} disablePadding sx={iconStyling(t.url)}>
                  <ListItemButton sx={drawerButtonStyling}>
                    <ListItemIcon sx={drawerIconStyling}> {t.icon} </ListItemIcon>
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
              <ListItemButton sx={drawerButtonStyling}>
                <ListItemIcon sx={drawerIconStyling} >
                  {/* @ts-expect-error valid style prop is not recognised */}
                  <SignInButton style={{ border: 'none' }}>
                    <LoginIcon sx={altIconStyle} />
                  </SignInButton>
                </ListItemIcon>
                {/* @ts-ignore */}
                <ListItemText primary="Login" sx={drawerTextStyling} />
              </ListItemButton>
            </ListItem>
          </Show>
          <Show when="signed-in" key="signin">
            <ListItem key="signed-in" disablePadding>
              <ListItemButton sx={drawerButtonStyling}>
                <ListItemIcon sx={drawerIconStyling} > <UserButton /> </ListItemIcon>
                {/* @ts-ignore */}
                <ListItemText primary="Profile" sx={drawerTextStyling} />
              </ListItemButton>
            </ListItem>
          </Show>
        </List>
      </Drawer>
    </Fragment >
  );
}
