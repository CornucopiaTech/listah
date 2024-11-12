
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';


import NavAppBar from '@/components/NavBar/AppBar';
import BasicTabs from '@/components/NavBar/NavTab';
import NavBar from '@/components/NavBar/NavBar';
import ItemsDisplay from './ItemDisplay';




import { getData } from '@/repository/faker';


import {DrawerWidth} from '@/model/defaultData';



export default function Items() {

	let data = getData(100);

	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex', width: '100%' }}>
					{/* <NavBar/> */}
					<NavAppBar />
					<Box 	component="main"
							sx={{ 	flexGrow: 1,
									flexWrap: 'wrap',
									width: '100%',
									height: '100%',
								}}
						>
						<Grid 	container
								spacing={{ xs: 1, sm: 2, md: 2 }}
								// columns={{ xs: 1, sm: 2, md: 2 }}
							>
							<ItemsDisplay data={data.data} tags={data.tags}/>
						</Grid>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
