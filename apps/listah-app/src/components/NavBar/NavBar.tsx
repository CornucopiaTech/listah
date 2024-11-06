'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
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




import MainDrawerList from './DrawerList';


import {ServicesNav, DrawerWidth, SubDividerMenuItems} from '@/model/defaultData';



export default function NavBar() {
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



  const servicesList = ServicesNav.map((anItem) =>  (
	<MainDrawerList key={anItem.title + '-DrawerList'}
					listTitle={anItem.title}
					subItems={anItem.subitems} />
  ));


  const subMenuList = (<List>
	{
	  SubDividerMenuItems.map((arrayObj) => (
		<ListItem key={arrayObj.title + '-listItem'} disablePadding>
		  <ListItemButton>
			<ListItemIcon>{arrayObj.icon}</ListItemIcon>
			<ListItemText primary={arrayObj.title} />
		  </ListItemButton>
		</ListItem>
	  ))
	}

  </List>);

  const drawer = (
	<React.Fragment>
	  <Toolbar />
	  <Divider />
	 {servicesList}
	  <Divider />
	  {subMenuList}
	</React.Fragment>
  );


  return (
	<React.Fragment key='AppNavBar'>
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
		aria-label="mailbox folders">
		<Drawer key='mobile-view'
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
			<div key='mobile-view'>{drawer}</div>

		</Drawer>
		<Drawer key='desktop-view' variant="permanent" open
		  sx={{
				display: { xs: 'none', sm: 'block' },
				'& .MuiDrawer-paper': { boxSizing: 'border-box', width: DrawerWidth },
		  }}>
		  <div key='desktop-view'>{drawer}</div>
		</Drawer>
	  </Box>
	</React.Fragment>
  );
}
