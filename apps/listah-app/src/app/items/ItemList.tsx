'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';



import TextFieldsLabelled from '@/components/Form/TextFieldsLabelled';
import ItemForm from './ItemView';
import ItemFilters from './ItemFilter';


function EachListItem(props){
	/**
	 * Component that lists out the items within the /items page.
	 * When an item from this list is clicked, the details of the items will populate the div component under or beside the list, depending on the viewport.
	 */
	// if (props.isSelected){
	// 	return (
	// 		<ListItem 	aria-describedby={props.id}
	// 					onClick={props.onClick} size='large'>
	// 			<ListItemButton>
	// 				<ListItemIcon>
	// 					{props.isSelected && <ExpandLessIcon/>}
	// 				</ListItemIcon>
	// 				<ListItemText primary={props.label} />
	// 			</ListItemButton>
	// 		</ListItem>
	// 	);
	// }
	return (
		<ListItem 	aria-describedby={props.id}
					onClick={props.onClick} size='large'>
			<ListItemButton>
				<ListItemIcon>
					{props.isSelected && <ExpandLessIcon/>}
				</ListItemIcon>
				<ListItemText primary={props.label} />
			</ListItemButton>
		</ListItem>
	);
}


export default function ItemsList(props) {
	const id = props.popperInfo ? 'simple-popper' : undefined;
	const clickedItem = React.useRef(null);
	// const clickedItem = React.useContext(ClickedItemContext);

	return (

		<List 		sx={{ 	width: '100%', p:2,
							maxHeight: {xs:240, sm: 240, md: 360, lg: 720, xl: 840},
							overflow: 'auto',
							bgcolor: 'cyan',
							justifyContent: "center",
							alignItems: "flex-start",
							border: 1,
							borderColor: 'rgba(50,50,50,0.3)',
				}}>
			{
				// ToDo: Make a vertical stack where the summary contains selected columns for the category
				// ToDo: Have a ticker button at the start of the list
				// ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
				props.data.map((item) => (
					<EachListItem 	variant="outlined"
									key={item.id}
									aria-describedby={id}
									sx={{}}
									onClick={() => props.onClick(item)} size='large'
									isSelected={props.popperInfo && item.id == props.popperInfo.id}
									label={item.summary}
					/>
				))
			}
		</List>
	);
}
