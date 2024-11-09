import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';



import styles from "./page.module.css";
import HomeCard from "@/app/home/HomeCard";
import NavBar from '@/components/NavBar/NavBar';

import {ServicesNav, DrawerWidth, SubDividerMenuItems} from '@/model/defaultData';



export default function Home() {

	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex' }}>
					<NavBar/>
					<Box component="main"
						sx={{	flexGrow: 1, p: 1,
								width: { sm: `calc(100% - ${DrawerWidth}px)` },
								bgcolor: '#cfe8fc',
								justifyContent: 'center',
								alignItems: 'center',}}>
						<Box sx={{ 	flexGrow: 1,
									justifyContent: 'space-evenly',
									alignItems: 'center', flexWrap: 'wrap',
									p: { xs: 4, md: 6 },
									height: '100%',
									width: '100%', bgcolor: '#cfffff'
								}}>
							<Grid 	container
									spacing={{ xs: 2, md: 3 }}
									columns={{ xs: 4, sm: 8, md: 12 }}>

								<Box sx={{flexGrow: 1,
											justifyContent: 'space-evenly', display: 'inline',
											alignItems: 'center', flexWrap: 'wrap',
											mt: { xs: 4, md: 6 }, height: '100%',
											width: '100%', bgcolor: '#efffff'}}>
										<Typography variant="h3"
													component="div" gutterBottom
													sx={{ color: 'text.secondary',
															textAlign: 'center',
															justifyContent: 'center',
															letterSpacing: 1,
														}}>
											Which list would you like?
										</Typography>

								</Box>

								<Box sx={{
											flexGrow: 1, justifyContent: 'space-evenly', display: 'flex',
											alignItems: 'center', flexWrap: 'wrap', p: { xs: 2, md: 3 },
											height: '100%', width: '100%', bgcolor: '#cfffff'
										}}>
									<HomeCard/>
								</Box>
							</Grid>
						</Box>
					</Box>
				</Box>
			</Container>
		</React.Fragment>
	);
}
