'use client'

import * as React from 'react';
import { useImmer } from 'use-immer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {enableMapSet} from "immer"

enableMapSet()

// Application Custom Components
import NavAppBar from '@/components/NavBar/AppBar';
import ItemsDisplay from './ItemDisplay';
import SortItems from './ItemSort';
import FilterItems from './ItemFiltering';


// Defined Reducers
import { ItemStyleContext } from '@/hooks/context/itemStylingContext';
import { getData } from '@/repository/fetcher';


export default function Items() {
	const styling = React.useContext(ItemStyleContext);
	let data = getData([''], '');
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [givenFilters, setGivenFilters] = React.useState([]);
	const visibleData = filterData().slice(0, 200);

	let categories = Array.from( new Set(visibleData.map((item) => item.category)));
	let tags = Array.from(new Set(visibleData.map((item) => item.tags).flat()));

	// Define initial state of the filter boxes
	let initialCheckStatus = new Map();
	categories.forEach((item) => initialCheckStatus.set(item, false));
	tags.forEach((item) => initialCheckStatus.set(item, false));
	const [checkStatus, updateCheckStatus] = useImmer(initialCheckStatus);


	function filterData(){
		if (givenFilters.length == 0){
			return data;
		}
		let finalData = new Array();
		for (const eachFilter of givenFilters){
			finalData = finalData.concat(data.filter((item) => item.tags.includes(eachFilter)));
			finalData = finalData.concat(data.filter((item) => item.category == eachFilter));
		}
		return finalData
	}

	function handleCheckStatus(event) {
		updateCheckStatus(draft => draft.set(event.target.name, event.target.checked));
	}

	function handleSubmit(event){
		event.preventDefault();
		setDrawerOpen(false);
		let parsedValues = new Array();
		checkStatus.forEach((avalue, akey, map) => {
			if (avalue){
				parsedValues.push(akey);
			}
		});
		setGivenFilters(parsedValues);
	}


	const toggleDrawer = (newOpen: boolean) => () => {
		setDrawerOpen(newOpen);
	};


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
								<FilterItems 	tags={tags}
												categories={categories}
												handleSubmit={handleSubmit}
												handleCheckStatus={handleCheckStatus}
												open={drawerOpen}
												toggleDrawer={toggleDrawer}
												checkStatus={checkStatus}/>
								<SortItems />
							</Box>
						</Box>
						<ItemsDisplay data={visibleData}/>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
