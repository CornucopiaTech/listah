'use client'
import * as React from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



type ListedItemProps = {
	variant: string;
	key: string;
	"aria-describedby": string | undefined;
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	size: string;
	isSelected: boolean;
	label: string;
}

type ListItemType = {}


function EachListedItem(props: ListedItemProps){
	/**
	 * Component that lists out the items within the /items page.
	 * When an item from this list is clicked, the details of the items will populate the div component under or beside the list, depending on the viewport.
	 */
	return (
		<ListItem
					aria-describedby={props["aria-describedby"]}
					onClick={props.onClick}
					size='large'>
			<ListItemButton>
				<ListItemIcon>
					{props.isSelected && <ExpandLessIcon/>}
				</ListItemIcon>
				<ListItemText primary={props.label} />
			</ListItemButton>
		</ListItem>
	);
}


export default function ItemsListings(props) {
	const id = props.selected ? 'simple-popper' : undefined;

	return (

		<List 	sx={{ 	width: '100%', p:2,
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
				props.data.map((item: ListItemType) => (
					<EachListedItem
									variant="outlined"
									key={item.id}
									aria-describedby={id}
									onClick={() => props.onClick(item)}
									size='large'
									isSelected={props.selected && item.id == props.selected.id}
									label={item.summary}
					/>
				))
			}
		</List>
	);
}
