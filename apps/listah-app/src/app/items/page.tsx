// 'use client'

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import ResponsiveGrid from '@/components/Grid/Responsive';
import SimpleContainer from '@/components/Container/FluidContainer';
import NavBar from '@/components/NavBar/NavBar';
import ItemAccordion from './ItemAccordion';
import ItemPopper from './ItemsPopover';
import ItemPopperButton from './ItemsPopoverButtons';


import { getCommerce } from '@/repository/faker';


import {DrawerWidth} from '@/model/defaultData';



export default function Items() {

	let data = getCommerce(5);
	// console.log(data);

	let accordionDetails = data.map((item, index) => (
		<ItemAccordion key={item.summary + '-ItemAccordion'}
					   summary={item.summary} index={index} item={item}/>
	));

	let popoverDetails = data.map((item, index) => (
		<ItemPopper key={item.summary + '-IItemPopper'}
					   summary={item.summary} index={index} item={item}/>
	));


	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex' }}>
					<NavBar/>
					<Box component="main"
						sx={{ flexGrow: 1, p: 3, display: 'inline-flex',
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
										spacing={{ xs: 1, sm: 2, md: 2 }}
										columns={{ xs: 1, sm: 2, md: 2 }}>
							<ItemPopperButton data={data} />
							<Box sx={{
										flexGrow: 1, justifyContent: 'space-between', display: 'flex', alignContent: 'flex-start',
										alignItems: 'center', flexWrap: 'wrap', p: { xs: 2, md: 3 },
										height: '100%', width: '100%', bgcolor: '#cfffff'
									}}>
								{accordionDetails}
							</Box>
							<Box sx={{
										flexGrow: 1, justifyContent: 'space-between', display: 'flex', alignContent: 'flex-start',
										alignItems: 'center', flexWrap: 'wrap', p: { xs: 2, md: 3 },
										height: '100%', width: '100%', bgcolor: '#cfffff'
									}}>
								{popoverDetails}
							</Box>
						</ResponsiveGrid>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);

}
