
import ResponsiveGrid from '@/components/Grid/Responsive';
import MediaCard, { ImgMediaCard } from '@/components/Card/Media';
import BasicGrid from '@/components/Grid/Basic';
import Box from '@mui/material/Box';

import { ServiceCard } from '@/model/defaultData';

// // Images for services cards.
// import groceries from './../../../public/assets/groceries.jpeg';
// import toDo from './../../../public/assets/todo.jpeg';


// const servicesObj = [
// 	{
// 		title: 'Grocery',
// 		url: groceries.src,
// 		actions: ["Learn More", "See More"],
// 		height: "240",
// 		altText: "Image of groceries",
// 		mainAction: "/grocery"
// 	},
// 	{
// 		title: 'To-Do',
// 		url: toDo.src,
// 		actions: ["Learn More", "See More"],
// 		height: "240",
// 		altText: "Image of a to-do list",
// 		mainAction: "/to-do"
// 	}
// ]

export default function HomeCard() {

	const servicesImageCards = ServiceCard.map((item) => (
			<ImgMediaCard key={item.title}
				   	  imageUrl={item.url}
					  imageAltText={item.altText}
					  imageTitle="" //{item.title}
					  imageHeight={item.height}
					  cardMainAction={item.mainAction}
					  cardHeading={item.title}
					  cardContent="" //{item.title}
					  cardActions={item.actions}/>
	));

	return (
		<>
			<ResponsiveGrid style={{flexGrow: 1,
											justifyContent: 'space-evenly',
											alignItems: 'space-around',
											flexWrap: 'wrap',
											height: '100%',
											width: '100%', bgcolor: '#cfffff'}}
									spacing={{ xs: 3, md: 4 }}
									columns={{ xs: 4, sm: 8, md: 12 }}>
				{servicesImageCards}
				{servicesImageCards}
				{servicesImageCards}
			</ResponsiveGrid>
		</>
	);
}
