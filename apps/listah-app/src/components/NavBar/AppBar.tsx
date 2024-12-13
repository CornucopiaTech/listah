'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';



export default function NavAppBar() {
  return (
	<React.Fragment>
		<AppBar
					sx={{width: '100%',}}
			>
			<Toolbar>
				<Box 	sx={{
								justifyContent: 'flex-start',
								display: 'inline-flex',
								width: '30%',
						}}
					>
					<Link href="/" underline="hover"
						style={{
							// ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
							color: "white",
							display: 'flex',
							flexWrap: 'nowrap', justifyContent: 'center'
						}}>
					<Typography variant="h6" noWrap component="div"> Listah</Typography>
					</Link>
				</Box>


				<Box 	sx={{
								justifyContent: 'space-evenly',
								display: 'inline-flex',
								ml: 6,
								width: '40%'

							}}
					>
					<Link 	href="/items" underline="hover"
							style={{
										// ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
										color: "white",
										display: 'flex',
										flexWrap: 'nowrap', justifyContent: 'center'
									}}>
						<Typography variant="h6" noWrap component="div"> Items</Typography>
					</Link>
					<Link	 href="/items" underline="hover"
							style={{
										// ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
										color: "white",
										display: 'flex',
										flexWrap: 'nowrap', justifyContent: 'center'
									}}>
					<Typography variant="h6" noWrap component="div"> Tags</Typography>
					</Link>
				</Box>


				<Box 	sx={{
								justifyContent: 'flex-end',
								display: 'inline-flex',
								width: '30%'
							}}
					>
					<Link href="/settings" underline="hover"
						style={{
							// ToDo: Set the link colour to secondary defined in the colour theme and not hard coded.
							color: "white",
							display: 'flex',
							flexWrap: 'nowrap', justifyContent: 'center'
						}}>
					<Typography variant="h6" noWrap component="div"> Settings</Typography>
					</Link>
				</Box>

			</Toolbar>
		</AppBar>
	</React.Fragment>

  );
}
