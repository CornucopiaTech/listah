import type {
  ReactNode
} from 'react';
import {
  Fragment,
} from 'react';
import { styled, useTheme, } from '@mui/material/styles';
import type { Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { } from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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
import Tooltip from '@mui/material/Tooltip';
import LoginIcon from '@mui/icons-material/Login';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TagIcon from '@mui/icons-material/Tag';
import PageviewIcon from '@mui/icons-material/Pageview';
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
} from '@/utils/defaults';
import { AppTooltip } from "@/components/core/AppTooltip";



const openedMixin = (theme: Theme): CSSObject => ({
  width: AppDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: AppDrawerWidth,
        width: `calc(100% - ${AppDrawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

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
    {
      icon: <ListAltIcon sx={altIconStyle} />,
      name: "Items",
      url: "/items"
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
  const drawerTextStyling = [store.drawerOpen ? { opacity: 1, } : { opacity: 0, },];
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
        }}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="primary" noWrap component="div" >
            Listah
          </Typography>
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
                <ListItemText primary="Login" sx={drawerTextStyling} />
              </ListItemButton>
            </ListItem>
          </Show>
          <Show when="signed-in" key="signin">
            <ListItem key="signed-in" disablePadding>
              <ListItemButton sx={drawerButtonStyling}>
                <ListItemIcon sx={drawerIconStyling} > <UserButton /> </ListItemIcon>
                <ListItemText primary="Profile" sx={drawerTextStyling} />
              </ListItemButton>
            </ListItem>
          </Show>
        </List>
      </Drawer>
    </Fragment >
  );
}
