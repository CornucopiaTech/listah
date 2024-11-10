'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';



import TextFieldsLabelled from '@/components/Form/TextFieldsLabelled';
import ItemView from './ItemView';
import ItemFilters from './ItemFilter';
import ItemsList from './ItemList';




export default function ItemsDisplay(props) {
	const [popperInfo, setPopperInfo] = React.useState(null);
	const id = popperInfo ? 'simple-popper' : undefined;


	function handleListClick(clickedItem) {
		// if (popperInfo){
		// 	console.log(`Prerender Anchor: ${popperInfo.summary}   Clicked: ${clickedItem.summary}  `);
		// } else {
		// 	console.log(`Prerender Anchor: ${popperInfo}   Clicked: ${clickedItem.summary}  `);
		// }

		if (popperInfo && popperInfo.id == clickedItem.id){
			setPopperInfo( null)
		} else {
			setPopperInfo(clickedItem)
		}
	};

	function handleSubmitSearch(e){
		e.preventDefault();
		// alert('Form submitted! Remove me in prod');
		console.log(e.target[0].value);
	}


	return (
		<React.Fragment>
			<Box 	sx={{ 	flexGrow: 1, display: 'block',
							width: '100%',
							height: '100%',
							bgcolor: '#7F4FD4',
							p: 3,
							flexWrap: 'wrap',
						}}
				>

				<Box 	sx={{ 	width: '100%',
								height: '100%',
								bgcolor: 'pink',
								justifyContent: 'center',
								alignItems: 'center',
								p: 3,
							}}
					>

						<Typography variant="h3"  gutterBottom
									sx={{
											justifyContent: 'center',
											alignItems: 'center',
											alignContent: 'center',
											pt:6,
										}}>
							Items
						</Typography>
				</Box>


				<Grid 	container
						spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
						columns={{ xs: 2, sm: 6, md: 12 }}
					>
					<Grid size={{xs:12, sm:12,  md: 12, lg:3, xl: 3 }} >
						{/* ToDO: Filter data result with search fields */}
						<ItemFilters 	searchSubmit={handleSubmitSearch}
										style={{	border: 1, p: 2,
													borderColor: 'rgba(50,50,50,0.3)',
													maxHeight: {xs:360, sm: 480, md: 600, lg: 720, xl: 840},

												}}/>
					</Grid>
					<Grid size='grow'>
						<ItemsList 	data={props.data} onClick={handleListClick}
									popperInfo={popperInfo}/>
					</Grid>
					<Grid size={{xs:12, sm:12,  md: 12, lg:3, xl: 3 }}>
						{
							popperInfo &&
								<ItemView 	key='ItemPopper'
											open={Boolean(popperInfo)}
											id={id}
											popperInfo={popperInfo}
											item={props.data.find((item) => item.id == popperInfo.id)}
								/>
						}
					</Grid>

				</Grid>
			</Box>
		</React.Fragment>

	);
}
