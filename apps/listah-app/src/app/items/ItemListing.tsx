'use client'
import * as React from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';


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



export default function ItemsListings(props) {
	const id = props.selectedItem ? 'simple-popper' : undefined;

	return (
		<Grid size='grow'>
			{/* Item list grid */}
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
						<ListItem
									key={item.id}
									variant="outlined"
									aria-describedby={id}
									onClick={() => props.handleListClick(item)}
									size='large'>
							<ListItemButton>
								<ListItemIcon>
									{
										props.selectedItem &&
										item.id == props.selectedItem.id &&
										<ExpandLessIcon/>}
								</ListItemIcon>
								<ListItemText primary={item.summary} />
							</ListItemButton>
						</ListItem>
					))
				}
			</List>
		</Grid>
	);
}
