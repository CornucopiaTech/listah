// import * as React from 'react';
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
import ItemsListings from './itemListing';
import {SortItems} from './itemSort';
import {FilterItems} from './itemFilter';



// Defined Reducers
import { ItemStyleContext } from '../../hooks/context/itemStylingContext';
import { getData } from '../../repository/fetcher';


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
	let categories = Array.from( new Set(data.map((item) => item.category)));
	let tags = Array.from(new Set(data.map((item) => item.tags).flat()));


    return <Fragment>
        <CssBaseline />

        <Container maxWidth="xl">
            <Box sx={styling.mainPage.baseContainerBox}>
                <NavAppBar />
                <Box component="main" sx={styling.mainPage.mainBox}>
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
                                tags={tags}
                                categories={categories}
                            />
                            <SortItems />
                        </Box>
                    </Box>
                    <Grid container
                        spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
                        columns={{ xs: 2, sm: 6, md: 12 }}>
                        <ItemsListings data={data}
                            // handleListClick={handleListClick}
                            // selectedItem={selectedItem}
                        />
                        {/* Item Display list.
								This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.
							*/}
                        {/* {
                            selectedItem &&
                            visibleData.filter((item) => item.id == selectedItem.id).length != 0 &&
                            <ItemView key='ItemPopper'
                                open={Boolean(selectedItem)}
                                id={id}
                                selected={selectedItem}
                            />
                        } */}

                    </Grid>

                </Box>
            </Box>
        </Container>
    </Fragment>

}
