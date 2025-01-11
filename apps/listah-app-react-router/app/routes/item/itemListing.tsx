'use client'
import * as React from 'react';
import {
    ExpandLess
} from '@mui/icons-material';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid2 as Grid
} from '@mui/material';






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



export default async function ItemsListings(props) {
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
										<ExpandLess/>}
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
