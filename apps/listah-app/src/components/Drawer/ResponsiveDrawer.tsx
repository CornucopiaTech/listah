'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import UnderlineLink from '../Link/Underline';
import {ServicesNav, DrawerWidth, SubDividerMenuItems} from '@/model/defaultData';



export default function ResponsiveDrawer({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  const servicesList = ServicesNav.map((arrayObj) => (
    <ListItem key={arrayObj.title} disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {arrayObj.icon}
        </ListItemIcon>
        <ListItemText primary={arrayObj.title} />
      </ListItemButton>
    </ListItem>
  ))

  const subMenuList = SubDividerMenuItems.map((arrayObj) => (
    <ListItem key={arrayObj.title} disablePadding>
      <ListItemButton>
        <ListItemIcon>
        {arrayObj.icon}
        </ListItemIcon>
        <ListItemText primary={arrayObj.title} />
      </ListItemButton>
    </ListItem>
  ));

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>{servicesList}</List>
      <Divider />
      <List>{subMenuList}</List>
    </div>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DrawerWidth}px)` },
          ml: { sm: `${DrawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

            <Link href="/" underline="hover"
                  style={{
                    // ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
                    color: "white",
                    display: 'flex',
                    flexWrap: 'nowrap', justifyContent: 'center'
                  }}>
              <Typography variant="h6" noWrap component="div"> Listah</Typography>
            </Link>

        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DrawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
        //   container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DrawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DrawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3,
              width: { sm: `calc(100% - ${DrawerWidth}px)` },
              bgcolor: '#cfe8fc',
                       justifyContent: 'center',
                       alignItems: 'center',}}>
        { children }
      </Box>
    </Box>
  );
}