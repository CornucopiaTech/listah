
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import ResponsiveGrid from '@/components/Grid/Responsive';
import NavBar from '@/components/NavBar/NavBar';
import ItemsDisplay from './ItemDisplay';



import { getCommerce } from '@/repository/faker';


import {DrawerWidth} from '@/model/defaultData';



export default function Items() {

	let data = getCommerce(100);

	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex' }}>
					<NavBar/>
					<Box 	component="main"
							sx={{ 	flexGrow: 1, p: 3, display: 'inline-flex',
									width: { sm: `calc(100% - ${DrawerWidth}px)` },
									bgcolor: '#cfe8fc',
									justifyContent: 'center',
									alignItems: 'center',
								}}
						>

						<ResponsiveGrid style={{
												flexGrow: 1,
												justifyContent: 'space-evenly',
												alignItems: 'center',
												flexWrap: 'wrap',
												p: { xs: 4, md: 6 },
												height: '100%',
												width: '100%', bgcolor: '#cfffff'
											}}
										spacing={{ xs: 1, sm: 2, md: 2 }}
										columns={{ xs: 1, sm: 2, md: 2 }}>
							<ItemsDisplay data={data} />
						</ResponsiveGrid>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
