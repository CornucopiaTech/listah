'use client'

import * as React from 'react';
import { useImmer } from 'use-immer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

import {enableMapSet} from "immer"

enableMapSet()

// Application Custom Components
import NavAppBar from '@/components/NavBar/AppBar';
import ItemsDisplay from './ItemDisplay';
import SortItems from './ItemSort';
import FilterItems from './ItemFiltering';
import ItemHeading from './ItemHeading';
import ItemView from './ItemView';
import ItemsListings from './ItemListing';


// Defined Reducers
import { ItemStyleContext } from '@/hooks/context/itemStylingContext';
import { get_items, getData } from '@/repository/fetcher';



type ListItemType = {}


export default function Items() {
	const styling = React.useContext(ItemStyleContext);


	// ##################################################################
	// ########## Initial data, tags and categories #####################
	// ##################################################################
	// let data = get_items([], [], []);
	let data = getData([], "");
	console.log("Returned data is:");
	console.log(data);
	let categories = Array.from( new Set(data.map((item) => item.category)));
	let tags = Array.from(new Set(data.map((item) => item.tags).flat()));


	// ##################################################################
	// ########### Filter checkboxes evolution ##########################
	// ##################################################################
	let initialFilterChecked = new Map();
	categories.forEach((item) => initialFilterChecked.set(item, false));
	tags.forEach((item) => initialFilterChecked.set(item, false));

	const [filterChecked, updateFilterChecked] = useImmer(initialFilterChecked);
	const givenFilters = new Array();
	filterChecked.forEach((avalue, akey, map) => {
		if (avalue){
			givenFilters.push(akey);
		}
	});

	function handleFilterChecked(event: React.MouseEvent<HTMLInputElement>) {
		updateFilterChecked(draft => draft.set(event.target.name, event.target.checked));
		setSelectedItem(null);
	}

	function handleFilterApply(event: React.MouseEvent<HTMLButtonElement>){
		event.preventDefault();
		setFilterDrawerOpen(false);
		// Clear the selected item
		setSelectedItem(null);
	}

	function handleFilterReset(event: React.MouseEvent<HTMLButtonElement>){
		updateFilterChecked(draft => {
			initialFilterChecked.forEach((value, key, map) => {
				draft.set(key, value);
			})
		});
		// Clear the selected item
		setSelectedItem(null);
	}


	// ##################################################################
	// ########### Page data evolution ##################################
	// ##################################################################
	const visibleData = filterData().slice(0, 20);
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


	// ##################################################################
	// ########### Drawer evolution #####################################
	// ##################################################################
	const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
	function toggleFilterDrawer(newOpen: boolean) {
		setFilterDrawerOpen(newOpen);
	};


	// ##################################################################
	// ########### Listing evolution ####################################
	// ##################################################################
	const [selectedItem, setSelectedItem] = React.useState<ListItemType | null>(null);
	const id = selectedItem ? 'simple-popper' : undefined;
	function handleListClick(clicked: ListItemType) {
		if (selectedItem && selectedItem.id == clicked.id){
			setSelectedItem(null);
		} else {
			setSelectedItem(clicked);
		}
	};

	// const [selectedItem, updateSelectedItem] = useImmer<ListItemType | null>(null);
	// const id = selectedItem ? 'simple-popper' : undefined;
	// function handleListClick(clicked: ListItemType) {
	// 	if (selectedItem && selectedItem.id == clicked.id){
	// 		updateSelectedItem(draft => null);
	// 	} else {
	// 		updateSelectedItem(draft => {
	// 			if (draft){
	// 				clicked.forEach((value, key, map) => {
	// 					draft.set(key, value);
	// 				})
	// 			} else {
	// 				draft = {}
	// 				clicked.forEach((value, key, map) => {
	// 					draft.set(key, value);
	// 				})
	// 			}
	// 		});
	// 	}
	// };



	// ##################################################################
	// ########### Viewing evolution ####################################
	// ##################################################################
	const [itemViewMode, setItemViewMode] = React.useState<string>('viewing');
	function handleitemViewTextChange(event, itemAttributeLabel, )


	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={styling.mainPage.baseContainerBox}>
					<NavAppBar />
					<Box component="main" sx={styling.mainPage.mainBox}>
						<ItemHeading 	tags={tags}
										categories={categories}
										handleFilterApply={handleFilterApply}
										handleFilterReset={handleFilterReset}
										handleFilterChecked={handleFilterChecked}
										filterDrawerOpen={filterDrawerOpen}
										closeFilterDrawer={() => {setFilterDrawerOpen(false)}}
										toggleFilterDrawer={toggleFilterDrawer}
										filterChecked={filterChecked}/>
						<Grid 	container
								spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
								columns={{ xs: 2, sm: 6, md: 12 }}>
							<ItemsListings 	data={visibleData}
											handleListClick={handleListClick}
											selectedItem={selectedItem}/>
							{/* Item Display list.
								This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.
							*/}
							{
								selectedItem &&
								visibleData.filter((item) => item.id == selectedItem.id).length != 0 &&
								<ItemView 	key='ItemPopper'
											open={Boolean(selectedItem)}
											id={id}
											selected={selectedItem}
								/>
							}

						</Grid>
						{/* <ItemsDisplay data={visibleData}/> */}
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
