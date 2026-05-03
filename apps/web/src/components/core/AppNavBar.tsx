import { Fragment } from "react";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Icon } from "@iconify/react";
import { useLocation } from '@tanstack/react-router';



// import AppBar from '@mui/material/AppBar';
import {
  Show, SignInButton, UserButton,
} from '@clerk/react';
import Link from '@mui/material/Link';


import {
  AppH5Typography,
} from "@/components/core/Typography";
import {
  AppBarHeight,
  AppDrawerWidth
} from '@/lib/helper/defaults';
import type { AppTheme } from '@/lib/styles/theme';
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import {
  AppItemSearchBar,
} from "@/components/core/AppSearchBar";
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
  MenuItem,
  MenuSeparator,
} from '@/components/base/Menubar';



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${AppBarHeight}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

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

export default function PersistentDrawerLeft() {
  const store: TBoundStore = useBoundStore((state) => state);
  const theme: AppTheme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={store.drawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => store.setDrawer(false)}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              store.drawer && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: AppBarHeight,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: AppBarHeight,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={store.drawer}
      >
        <DrawerHeader>
          <IconButton onClick={() => store.setDrawer(false)}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
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
      </Drawer>
      <Main open={store.drawer}>
        <DrawerHeader />
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
          tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
          sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
          tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
          gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
          et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
          tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Main>
    </Box>
  );
}



export function AppNavBar() {
  const theme: AppTheme = useTheme();
  const store: TBoundStore = useBoundStore((state) => state);
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const header = pathname.includes("/filters") ? "Filters" : pathname.includes("/tags") ? "Tags" : pathname.includes("/items") ? "Items" : "Home";

  function checkActive(val: string) {
    return pathname.includes(val) ? "always" : "none"
  }

  return (
    <Fragment>
      <AppBar position="static"
        sx={{ width: '100%', height: AppBarHeight, }}
        elevation={1} >
        <Toolbar sx={{ bgcolor: theme.palette.background.default, }}>
          <AppToolbarStack>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => store.setDrawer(!store.drawer)}
              edge="start"
              sx={[{ mr: 2, }, store.drawer && { display: 'none' },]} >
              <Icon icon="ic:baseline-menu" width="30" height="30" style={{ color: theme.palette.primary.main }} />
            </IconButton>
            <AppH5Typography> {header} </AppH5Typography>
            <AppItemSearchBar />
            <Menubar style={{ backgroundColor: theme.palette.background.default, }}>
              <MenuRoot>
                <MenuTrigger><Icon icon="charm:menu-kebab" width="30" height="30" style={{ color: theme.palette.primary.main }} /></MenuTrigger>
                <MenuPortal>
                  <MenuPositioner sideOffset={4} alignOffset={-2}>
                    <MenuPopup>
                      <MenuItem hint="⌘N">New</MenuItem>
                      <MenuItem hint="⌘O">Open...</MenuItem>
                      <MenuItem hint="⌘S">Save</MenuItem>
                      <MenuItem hint="⇧⌘S">Save As...</MenuItem>
                      <MenuSeparator />
                      <MenuItem hint="⌘P">Print...</MenuItem>
                    </MenuPopup>
                  </MenuPositioner>
                </MenuPortal>
              </MenuRoot>
            </Menubar>


          </AppToolbarStack>

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: AppDrawerWidth, flexShrink: 0,
          '& .MuiDrawer-paper': { width: AppDrawerWidth, boxSizing: 'border-box', },
        }}
        variant="persistent"
        anchor="left"
        open={store.drawer} >
        <DrawerHeader>
          <IconButton onClick={() => store.setDrawer(false)}>
            {theme.direction === 'ltr' ? <Icon icon="ic:baseline-chevron-left" width="30" height="30" style={{ color: theme.palette.primary.main }} /> : <Icon icon="ic:baseline-chevron-right" width="30" height="30" style={{ color: theme.palette.primary.main }} />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          <Link underline={checkActive("/tags")} key="tags" href="/tags" >
            <ListItem key={"tags"} disablePadding>
              <ListItemButton>
                <ListItemText primary="Tags" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link underline={checkActive("/filters")} key="filters" href="/filters" >
            <ListItem key={"tags"} disablePadding>
              <ListItemButton>
                <ListItemText primary="Filters" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link underline={checkActive("/settings")} key="settings" href="/settings" >
            <ListItem key={"tags"} disablePadding>
              <ListItemButton>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem key={"tags"} disablePadding>
            <ListItemButton>
              <Show when="signed-out" key="signout">
                <ListItemText primary="Sign In" />
                <SignInButton />
              </Show>
            </ListItemButton>
          </ListItem>

          <ListItem key={"tags"} disablePadding>
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
