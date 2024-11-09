
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



import { ServiceCard } from '@/model/defaultData';



function BasicCard(props) {
	const cardActions = props.cardActions.map((item) => (
		<Button key={item + 'Button'}
				size="small">{item}
		</Button>
	  ));

	return (
		<Card sx={props.style}>
			<CardContent>
				<Typography variant="h5"
							component="div" gutterBottom
							sx={{ 	color: 'text.secondary',
									textAlign: 'center',
									letterSpacing: 1,
									pt: 1, px: 4}}>
					{props.cardHeading}
				</Typography>

				<Typography variant="body2"
							sx={{ color: 'text.secondary' }}
				>
					{props.cardContent}
				</Typography>

				</CardContent>
			<CardActions>{cardActions}</CardActions>
		</Card>
	);
}



export default function HomeCard() {

	const servicesImageCards = ServiceCard.map((item) => (
			<BasicCard 	key={item.title}
						style={{ minWidth: 275 }}
						cardMainAction={item.mainAction}
						cardHeading={item.title}
						cardContent="" //{item.title}
						cardActions={item.actions}/>
	));

	return (
		<React.Fragment>
			<Box 	sx={{
								flexGrow: 1,
							justifyContent: 'space-evenly',
							alignItems: 'space-around',
							flexWrap: 'wrap',
							height: '100%',
							width: '100%', bgcolor: '#cfffff'
						}}>
				<Grid 	container
						spacing={{ xs: 3, md: 4 }}
						columns={{ xs: 4, sm: 8, md: 12 }}>

					{servicesImageCards}
					{/* {servicesImageCards} */}
					{/* {servicesImageCards} */}
				</Grid>
			</Box>
		</React.Fragment>
	);
}
