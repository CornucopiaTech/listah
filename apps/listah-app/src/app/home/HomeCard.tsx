import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { BasicCardBlock } from '@/components/Card/BasicCard';
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import MediaCard from '@/components/Card/Mediacard';


const services = [
	{title: 'Grocery', url: "", actions: []},
	{title: 'To-Do', url: "", actions: []}
]

export default function HomeCard() {
	const listServices = services.map((item) => (
		<BasicCardBlock >
			<Typography variant="h5" component="div">
				{item}
			</Typography>
		</BasicCardBlock>
	));
	const servicesCards = services.map((item) => (
		<MediaCard imageUrl=""/>
	));

	const listServicesInline = services.map((item) => (
			<Grid key={item}
			      size={{ xs: 2, sm: 4, md: 4 }}
						rowSpacing={{ xs: 4, md: 6 }}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
						sx={{mx: 8, my: 4 }}>
				<Typography variant="h5" component="div"
										sx={{ color: 'text.secondary',
											textAlign: 'center',
											letterSpacing: 1.5}}
				>
					{item}
				</Typography>
			</Grid>

	));


	return (
	<>
		{/* <ResponsiveGrid>
			{listServices}
		</ResponsiveGrid> */}

		<ResponsiveGrid>
			{listServicesInline}
		</ResponsiveGrid>


	</>);
}
