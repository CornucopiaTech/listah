'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


// Application Custom Components
import SortItems from './ItemSort';
import FilterItems from './ItemFiltering';


// Defined Context
import { ItemStyleContext } from '@/hooks/context/itemStylingContext';



export default function ItemHeading(props) {
	const styling = React.useContext(ItemStyleContext);


	return (
		<React.Fragment>
			<Box sx={styling.mainPage.headingBox}>
				{/* Page heading with title, sorting and filers*/}
				<Typography variant="h6"
							gutterBottom sx={styling.mainPage.headingTypography}>
								Items
				</Typography>
				<Box sx={styling.mainPage.filterSortBox}>
					{/* Page filter and sort */}
					<FilterItems 	tags={props.tags}
									categories={props.categories}
									handleFilterApply={props.handleFilterApply}
									handleFilterReset={props.handleFilterReset}
									handleFilterChecked={props.handleFilterChecked}
									filterDrawerOpen={props.filterDrawerOpen}
									closeFilterDrawer={props.closeFilterDrawer}
									toggleFilterDrawer={props.toggleFilterDrawer}
									filterChecked={props.filterChecked}/>
					<SortItems />
				</Box>
			</Box>
		</React.Fragment>
	);

}
