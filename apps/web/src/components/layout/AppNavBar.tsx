import type {
  ReactNode
} from 'react';
import { Fragment } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Icon } from "@iconify/react";
import { useLocation } from '@tanstack/react-router';
import {
  Show, SignInButton, UserButton,
} from '@clerk/react';
import Link from '@mui/material/Link';



import {
  AppBarHeight,
  AppDrawerWidth
} from '@/utils/defaults';
import type { AppTheme } from '@/system/theme';
import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import {
  AppItemSearchBar,
} from "@/components/layout/AppSearchBar";
import {
  AppToolbarStack,
} from "@/components/core/AppStack";
import {
  Menubar,
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
} from '@/components/base/Menubar';



interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${AppBarHeight}px)`,
        marginLeft: `${AppBarHeight}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));




export function AppNavBarPrimaryTheme({ menuItems, title }: { menuItems?: ReactNode, title?: string }) {
  const theme: AppTheme = useTheme();
  const store: TAppStore = useAppStore((state) => state);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const header = title ? title : pathname.includes("/filters") ? "Filters" : pathname.includes("/tags") ? "Tags" : pathname.includes("/items") ? "Items" : "";
  const pageTitle = header.length < 34 ? header : `${header.substring(0, 24)}...`

  function checkActive(val: string) {
    return pathname.includes(val) ? "always" : "none"
  }

  const drawerSx = {
    width: AppDrawerWidth, flexShrink: 0,
    '& .MuiDrawer-paper': { width: AppDrawerWidth, boxSizing: 'border-box', },
  }

  return (
    <Fragment>
      <AppBar
        position="static"
        sx={{ width: '100%', height: AppBarHeight, }}
        elevation={1} >
        <Toolbar sx={{ backgroundColor: theme.palette.primary.main }}>
          <AppToolbarStack>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => store.toggleDrawer(!store.drawerOpen)}
              edge="start"
              sx={[{ mr: 2, }, store.drawerOpen && { display: 'none' },]} >
              <Icon
                icon="ic:baseline-menu" width="24" height="24"
                style={{ color: theme.palette.primary.contrastText }}
              />
            </IconButton>
            <Typography variant="h6"
            // sx={{ color: theme.palette.primary.contrastText, }}
            > {pageTitle} </Typography>
            <AppItemSearchBar />
            {
              menuItems &&
              <Menubar style={{ backgroundColor: theme.palette.primary.main, }}>
                <MenuRoot>
                  <MenuTrigger>
                    <Icon
                      icon="charm:menu-kebab" width="24" height="24"
                      style={{ color: theme.palette.primary.contrastText }}
                    />
                  </MenuTrigger>
                  <MenuPortal>
                    <MenuPositioner sideOffset={4} alignOffset={-2}>
                      <MenuPopup>
                        {menuItems}
                      </MenuPopup>
                    </MenuPositioner>
                  </MenuPortal>
                </MenuRoot>
              </Menubar>
            }
          </AppToolbarStack>
        </Toolbar>
      </AppBar>
      <Drawer sx={drawerSx} variant="persistent" anchor="left"
        open={store.drawerOpen} onClose={() => store.toggleDrawer(false)}>
        <DrawerHeader>
          <IconButton onClick={() => store.toggleDrawer(false)}>
            {theme.direction === 'ltr' ? <Icon icon="ic:baseline-chevron-left" width="24" height="24" style={{ color: theme.palette.primary.main }} /> : <Icon icon="ic:baseline-chevron-right" width="24" height="24" style={{ color: theme.palette.primary.main }} />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          <Link underline={checkActive("/tags")} key="tags" href="/tags" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Tags</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link underline={checkActive("/filters")} key="filters" href="/filters" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Filters</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem key="signin" disablePadding>
            <ListItemButton>
              <Show when="signed-out" key="signout">
                {/* @ts-ignore */}
                <SignInButton style={{ border: 'none' }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ p: 0, m: 0 }}>Sign In</Typography>
                    } />
                </SignInButton>
              </Show>
            </ListItemButton>
          </ListItem>

          <ListItem key="signed-in" disablePadding>
            <ListItemButton>
              <Show when="signed-in" key="signin">
                <UserButton />
              </Show>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Fragment>
  );
}

export function AppNavBar() {
  const theme: AppTheme = useTheme();
  const store: TAppStore = useAppStore((state) => state);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  function checkActive(val: string) {
    return pathname.includes(val) ? "always" : "none"
  }

  const drawerSx = {
    width: AppDrawerWidth, flexShrink: 0,
    '& .MuiDrawer-paper': { width: AppDrawerWidth, boxSizing: 'border-box', },
  }

  return (
    <Box sx={{ padding: "10px" }}>
      <AppToolbarStack>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => store.toggleDrawer(!store.drawerOpen)}
          edge="start"
          sx={[{ mr: 2, }, store.drawerOpen && { display: 'none' },]} >
          <Icon
            icon="ic:baseline-menu" width="30" height="30"
            style={{ color: theme.palette.primary.main }}
          />
        </IconButton>
      </AppToolbarStack>
      <Box sx={{ backgroundColor: theme.palette.primary.main, width: 'fit-content' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => store.toggleDrawer(!store.drawerOpen)}
          edge="start"
          sx={[{ mr: 2, }, store.drawerOpen && { display: 'none' },]} >
          <Icon
            icon="ic:baseline-menu" width="30" height="30"
            style={{ color: theme.palette.primary.main }}
          />
        </IconButton>
      </Box>
      <Drawer sx={drawerSx} variant="persistent" anchor="left"
        open={store.drawerOpen} onClose={() => store.toggleDrawer(false)}>
        <DrawerHeader>
          <IconButton onClick={() => store.toggleDrawer(false)}>
            {theme.direction === 'ltr' ? <Icon icon="ic:baseline-chevron-left" width="24" height="24" style={{ color: theme.palette.primary.main }} /> : <Icon icon="ic:baseline-chevron-right" width="24" height="24" style={{ color: theme.palette.primary.main }} />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          <Link underline={checkActive("/tags")} key="tags" href="/tags" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Tags</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link underline={checkActive("/filters")} key="filters" href="/filters" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Filters</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem key="signin" disablePadding>
            <ListItemButton>
              <Show when="signed-out" key="signout">
                {/* @ts-ignore */}
                <SignInButton style={{ border: 'none' }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ p: 0, m: 0 }}>Sign In</Typography>
                    } />
                </SignInButton>
              </Show>
            </ListItemButton>
          </ListItem>

          <ListItem key="signed-in" disablePadding>
            <ListItemButton>
              <Show when="signed-in" key="signin">
                <UserButton />
              </Show>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export function AppMenuButton() {
  const theme: AppTheme = useTheme();
  const store: TAppStore = useAppStore((state) => state);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  function checkActive(val: string) {
    return pathname.includes(val) ? "always" : "none"
  }

  const drawerSx = {
    width: AppDrawerWidth, flexShrink: 0,
    '& .MuiDrawer-paper': { width: AppDrawerWidth, boxSizing: 'border-box', },
  }

  return (
    <Fragment>
      <Box sx={{
        backgroundColor: theme.palette.background.default, width: 'fit-content', display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => store.toggleDrawer(!store.drawerOpen)}
          edge="start"
          sx={[{ mr: 2, }, store.drawerOpen && { display: 'none' },]} >
          <Icon
            icon="ic:baseline-menu" width="30" height="30"
            style={{ color: theme.palette.primary.main }}
          />
        </IconButton>
      </Box>
      <Drawer sx={drawerSx} variant="persistent" anchor="left"
        open={store.drawerOpen} onClose={() => store.toggleDrawer(false)}>
        <DrawerHeader>
          <IconButton onClick={() => store.toggleDrawer(false)}>
            {theme.direction === 'ltr' ? <Icon icon="ic:baseline-chevron-left" width="24" height="24" style={{ color: theme.palette.primary.main }} /> : <Icon icon="ic:baseline-chevron-right" width="24" height="24" style={{ color: theme.palette.primary.main }} />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          <Link underline={checkActive("/tags")} key="tags" href="/tags" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Tags</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link underline={checkActive("/filters")} key="filters" href="/filters" onClick={() => store.toggleDrawer(false)}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ p: 0, m: 0 }}>Filters</Typography>
                  } />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem key="signin" disablePadding>
            <ListItemButton>
              <Show when="signed-out" key="signout">
                {/* @ts-ignore */}
                <SignInButton style={{ border: 'none' }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ p: 0, m: 0 }}>Sign In</Typography>
                    } />
                </SignInButton>
              </Show>
            </ListItemButton>
          </ListItem>

          <ListItem key="signed-in" disablePadding>
            <ListItemButton>
              <Show when="signed-in" key="signin">
                <UserButton />
              </Show>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Fragment>
  );
}
