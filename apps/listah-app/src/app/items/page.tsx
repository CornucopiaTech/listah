'use client'

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';



// Application Custom Components
import NavAppBar from '@/components/NavBar/AppBar';
import ItemsDisplay from './ItemDisplay';
import SortItems from './ItemSort';
import FilterItems from './ItemFiltering';



import { getData } from '@/repository/faker';


// Defined Reducers
import { ItemStyleContext } from '@/hooks/context/itemStylingContext';



export default function Items() {
	const styling = React.useContext(ItemStyleContext);

	let {data, tags, categories} = getData(100);

	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={styling.mainPage.baseContainerBox}>
					<NavAppBar />
					<Box component="main" sx={styling.mainPage.mainBox}>
						<Box sx={styling.mainPage.headingBox}>
							{/* Page heading with title, sorting and filers*/}
							<Typography variant="h6" gutterBottom sx={styling.mainPage.headingTypography}>Items</Typography>
							<Box sx={styling.mainPage.filterSortBox}>
								{/* Page filter and sort */}
								<FilterItems tags={tags} categories={categories}/>
								<SortItems />
							</Box>
						</Box>
						<ItemsDisplay data={data}/>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
