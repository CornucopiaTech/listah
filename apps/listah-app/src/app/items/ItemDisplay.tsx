'use client'
import * as React from 'react';
import Grid from '@mui/material/Grid2';


// Application Custom Components
import ItemView from './ItemView';
import ItemsListings from './ItemListing';


// Defined Reducers
import { ItemStyleContext } from '@/hooks/context/itemStylingContext';





// Application Reducers

type ListItemType = {}


export default function ItemsDisplay(props) {
	const [selectedItem, setSelectedItem] = React.useState<ListItemType | null>(null);
	const id = selectedItem ? 'simple-popper' : undefined;
	const styling = React.useContext(ItemStyleContext);


	function handleListClick(clicked: ListItemType) {
		if (selectedItem && selectedItem.id == clicked.id){
			setSelectedItem(null);
		} else {
			setSelectedItem(clicked);
		}
	};

	function handleSubmitSearch(e){
		e.preventDefault();
		// alert('Form submitted! Remove me in prod');
		console.log(e.target[0].value);
	}


	function handleResetSubmit(e){
		e.preventDefault();
		// alert('Form submitted! Remove me in prod');
		console.log(e.target[0].value);
	}

	function handleApplySubmit(e){
		e.preventDefault();
		// alert('Form submitted! Remove me in prod');
		console.log(e.target[0].value);
	}


	return (
		<React.Fragment>
			<Grid 	container
					spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
					columns={{ xs: 2, sm: 6, md: 12 }}
				>
				<Grid size='grow'>
					{/* Item list grid */}

					<ItemsListings
									data={props.data}
									onClick={handleListClick}
									selected={selectedItem}/>

				</Grid>
				<Grid size={{xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
					{/* Item Display list */}

					{
						selectedItem &&
							<ItemView 	key='ItemPopper'
										open={Boolean(selectedItem)}
										id={id}
										selected={selectedItem}
							/>
					}
				</Grid>

			</Grid>
		</React.Fragment>

	);
}
