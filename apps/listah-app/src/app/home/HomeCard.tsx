
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import MediaCard, { ImgMediaCard } from '@/components/Card/MediaCard';

// Images for services cards.
import groceries from './../../../public/assets/groceries.jpeg';
import toDo from './../../../public/assets/todo.jpeg';


const servicesObj = [
	{
		title: 'Grocery',
		url: groceries.src,
		actions: ["Learn More", "See More"],
		height: "240",
		altText: "Image of groceries",
		mainAction: "/grocery"
	},
	{
		title: 'To-Do',
		url: toDo.src,
		actions: ["Learn More", "See More"],
		height: "240",
		altText: "Image of a to-do list",
		mainAction: "/to-do"
	}
]

export default function HomeCard() {
	console.log(`Groceries: ${groceries.src}`);
	console.log(groceries);


	const servicesImageCards = servicesObj.map((item) => (
		<ImgMediaCard key={item.title}
				   	  imageUrl={item.url}
					  imageAltText={item.altText}
					  imageTitle="" //{item.title}
					  imageHeight={item.height}
					  cardMainAction={item.mainAction}
					  cardHeading={item.title}
					  cardContent="" //{item.title}
					  cardActions={item.actions}

		/>
	));

	return (
	<>
		<ResponsiveGrid>
			{servicesImageCards}
		</ResponsiveGrid>


	</>);
}
