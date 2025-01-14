
import {
	useContext,
	Fragment

} from 'react';
import {
	CssBaseline,
	Box,
	Container,
	Typography,
	Grid2 as Grid
} from '@mui/material';


// Application Custom Components
import {NavAppBar} from '../../components/NavBar/AppBar';
import ItemView from './itemView';
import { ItemsAuxillary } from './itemsAuxillary';



// Defined Reducers
import { ItemStyleContext } from '../../hooks/context/itemStylingContext';
import { getData } from '../../repository/fetcher';


import type { ItemModel } from '~/model/item';


type ListItemType = {}


export function ItemsPage() {
	const styling = useContext(ItemStyleContext);


	// // ##################################################################
	// // ########## Initial data, tags and categories #####################
	// // ##################################################################
	// let data = get_items([], [], []);
	let data = getData([], "");
	// console.log("Returned data is:");
	// console.log(data);
	let categories = Array.from(new Set(data.map((item: ItemModel) => item.category)));
	let tags = Array.from(new Set(data.map((item: ItemModel) => item.tags).flat()));


	return (
		<Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={styling.mainPage.baseContainerBox}>
					<NavAppBar />
					<Box component="main" sx={styling.mainPage.mainBox}>
						<ItemsAuxillary tags={tags} categories={categories} />
						<ItemView data={data}/>
					</Box>
				</Box>
			</Container>
		</Fragment>
	);

}
