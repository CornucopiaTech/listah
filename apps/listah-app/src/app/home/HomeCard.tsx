
import ResponsiveGrid from '@/components/Grid/Responsive';
import { ImgMediaCard } from '@/components/Card/Media';
import BasicCard from '@/components/Card/Basic';


import { ServiceCard } from '@/model/defaultData';


export default function HomeCard() {

	const servicesImageCards = ServiceCard.map((item) => (
			<BasicCard key={item.title}
					   style={{ minWidth: 275 }}
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
