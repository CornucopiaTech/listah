'use client'

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
	<div
	  role="tabpanel"
	  hidden={value !== index}
	  id={`simple-tabpanel-${index}`}
	  aria-labelledby={`simple-tab-${index}`}
	  {...other}
	>
	  {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</div>
  );
}

function a11yProps(index: number) {
  return {
	id: `simple-tab-${index}`,
	'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
	setValue(newValue);
  };

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


  return (
	<Box sx={{ width: '100%' }}>
		<AppBar 	position="fixed"
					sx={{width: '100%',}}
			>
			<Toolbar>
				<IconButton 	color="inherit"
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
	</Box>
  );
}
