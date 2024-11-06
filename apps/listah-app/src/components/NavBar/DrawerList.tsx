'use client'

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';





export default function MainDrawerList(props) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const handleClickDrawer = () => {setOpenDrawer(!openDrawer);};

//   console.log()

  return (
	<React.Fragment key={'NavBar-' + props.listTitle}>
		<ListItemButton
						 onClick={handleClickDrawer}>
			<ListItemText primary={props.listTitle} />
			{openDrawer ? <ExpandLess /> : <ExpandMore />}
		</ListItemButton>
		<Collapse in={openDrawer} timeout="auto" unmountOnExit>
			<List
				  component="div" disablePadding>
				{props.subItems.map((it) => (
					<ListItemButton key={it.title + '-' + props.listTitle} sx={{ pl: 4 }}>
						<ListItemText primary={it.title} />
					</ListItemButton>
				))}
			</List>
		</Collapse>
	</React.Fragment>

  );
}
