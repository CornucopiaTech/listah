// import * as React from 'react';
import {
    useContext,
    Fragment

} from 'react';
import {
    Box,
    Typography,
    Grid2 as Grid
} from '@mui/material';


// Application Custom Components
import {SortItems} from './itemSort';
import {FilterItems} from './itemFilter';



// Defined Reducers
import { ItemStyleContext } from '../../hooks/context/itemStylingContext';
import { getData } from '../../repository/fetcher';


type ListItemType = {}


export function ItemsAuxillary(props) {
	const styling = useContext(ItemStyleContext);


    return (
		<Box sx={styling.mainPage.headingBox}>
			{/* Page heading with title, sorting and filers*/}
			<Typography variant="h6"
				gutterBottom sx={styling.mainPage.headingTypography}>
				Items
			</Typography>
			<Box sx={styling.mainPage.filterSortBox}>
				{/* Page filter and sort */}
				<FilterItems
				// ToDo: Make api calls for these values and remove the values from prop.
					tags={props.tags}
					categories={props.categories}
				/>
				<SortItems />
			</Box>
		</Box>
	);
}
