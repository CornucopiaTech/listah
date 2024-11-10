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


function ListItems(props){
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
	// const [popperInfo, setPopperInfo] = React.useState(null);
	const id = props.popperInfo ? 'simple-popper' : undefined;


	// function handleClick(clickedItem) {
	// 	// if (popperInfo){
	// 	// 	console.log(`Prerender Anchor: ${popperInfo.summary}   Clicked: ${clickedItem.summary}  `);
	// 	// } else {
	// 	// 	console.log(`Prerender Anchor: ${popperInfo}   Clicked: ${clickedItem.summary}  `);
	// 	// }

	// 	if (popperInfo && popperInfo.id == clickedItem.id){
	// 		setPopperInfo( null)
	// 	} else {
	// 		setPopperInfo(clickedItem)
	// 	}
	// };


	return (


		<List 		sx={{ 	width: '100%', p:2,
							maxHeight: {xs:360, sm: 480, md: 600, lg: 720, xl: 840},
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
					<ListItems 	variant="outlined"
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
