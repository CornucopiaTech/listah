// 'use client'

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import ResponsiveGrid from '@/components/Grid/Responsive';
import SimpleContainer from '@/components/Container/FluidContainer';
import NavBar from '@/components/NavBar/NavBar';
import ItemAccordion from './ItemAccordion';


import { getCommerce } from '@/repository/faker';


import {DrawerWidth} from '@/model/defaultData';



export default function Items() {

	let data = getCommerce(100);

	let accordionDetails = data.map((item, index) => (
		<ItemAccordion key={item.summary + '-ItemAccordion'}
					   summary={item.summary} index={index} item={item}/>
	));


	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex' }}>
					<NavBar/>
					<Box component="main"
						sx={{ flexGrow: 1, p: 1,
							width: { sm: `calc(100% - ${DrawerWidth}px)` },
							bgcolor: '#cfe8fc',
							justifyContent: 'center',
							alignItems: 'center',}}>

						<ResponsiveGrid style={{flexGrow: 1,
												justifyContent: 'space-evenly',
												alignItems: 'center', flexWrap: 'wrap',
												p: { xs: 4, md: 6 },
												height: '100%',
												width: '100%', bgcolor: '#cfffff'}}
										spacing={{ xs: 2, md: 3 }}
										columns={{ xs: 4, sm: 8, md: 12 }}>
							<Box sx={{
										flexGrow: 1, justifyContent: 'space-evenly', display: 'flex',
										alignItems: 'center', flexWrap: 'wrap', p: { xs: 2, md: 3 },
										height: '100%', width: '100%', bgcolor: '#cfffff'
									}}>
								{accordionDetails}
							</Box>
						</ResponsiveGrid>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
