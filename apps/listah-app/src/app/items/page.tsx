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
	let categories = Array.from( new Set(data.map((item) => item.category)));
	let tags = Array.from(new Set(data.map((item) => item.tags).flat()));

	// Define initial state of the filter boxes
	let initialCheckStatus = new Map();
	categories.forEach((item) => initialCheckStatus.set(item, false));
	tags.forEach((item) => initialCheckStatus.set(item, false));
	const [checkStatus, updateCheckStatus] = useImmer(initialCheckStatus);
	const givenFilters = new Array();
	checkStatus.forEach((avalue, akey, map) => {
		if (avalue){
			givenFilters.push(akey);
		}
	});
	const visibleData = filterData().slice(0, 200);
	const [drawerOpen, setDrawerOpen] = React.useState(false);




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
	}

	function handleReset(event){
		updateCheckStatus(draft => {
			initialCheckStatus.forEach((value, key, map) => {
				draft.set(key, value);
			})
		});
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
												handleReset={handleReset}
												handleCheckStatus={handleCheckStatus}
												open={drawerOpen}
												closeDrawer={() => {setDrawerOpen(false)}}
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
