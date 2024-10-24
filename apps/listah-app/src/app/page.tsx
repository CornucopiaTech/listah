import Box from '@mui/material/Box';

import styles from "./page.module.css";
import PersistentDrawerLeft from "@/components/Drawer/PersistentDrawer";
import HomeCard from "@/app/home/HomeCard";
import ResponsiveGrid from '@/components/Grid/Responsive';
import HeroTypography from '@/components/Typography/Hero';
import BasicGrid from '@/components/Grid/Basic';
import SimpleContainer from '@/components/Container/FluidContainer';

export default function Home() {
	const gridInfo = [
		{height: 8},
		{height: 8},
		{height: 8},
	]

	const centeringGrids = gridInfo.map((item) => (
		<BasicGrid height={item.height}/>
	));

	return (
		<SimpleContainer>
			<PersistentDrawerLeft>
			<ResponsiveGrid spacing={{ xs: 2, md: 3 }} flexGrow={1}
							columns={{ xs: 2, sm: 4, md: 6 }} flexWrap='wrap'
							justifyContent='space-evenly' alignItems='center'
							padding={{ xs: 2, md: 3 }} height='100%'
							width={{ xs: '300', md: '600', lg: '800' }}>
				<Box sx={{ bgcolor: '#cfe8fc', justifyContent: 'center',
							px: { xs: 2, md: 3 },
							height: '100%',
							width: { xs: '300', md: '600', lg: '800' },
							//    width: 'fit-content',
							// width: '100%',
							}}>
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
					<HeroTypography content='Which list would you like' />
				</Box>
			</ResponsiveGrid>

		</PersistentDrawerLeft>
		</SimpleContainer>

	);
}

// export default function Home() {
// 	const gridInfo = [
// 		{height: 8},
// 		{height: 8},
// 		{height: 8},
// 	]

// 	const centeringGrids = gridInfo.map((item) => (
// 		<BasicGrid height={item.height}/>
// 	));

// 	return (
// 		<PersistentDrawerLeft>
// 			<ResponsiveGrid spacing={{ xs: 2, md: 3 }} flexGrow={1}
// 							columns={{ xs: 2, sm: 4, md: 6 }} flexWrap='wrap'
// 							justifyContent='space-evenly' alignItems='center'
// 							padding={{ xs: 2, md: 3 }} height='100%'
// 							width={{ xs: '300', md: '600', lg: '800' }}>
// 				<Box sx={{ bgcolor: '#cfe8fc', justifyContent: 'center',
// 							px: { xs: 2, md: 3 },
// 							height: '100%',
// 							width: { xs: '300', md: '600', lg: '800' },
// 							//    width: 'fit-content',
// 							// width: '100%',
// 							}}>
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 					<HeroTypography content='Which list would you like' />
// 				</Box>
// 			</ResponsiveGrid>

// 		</PersistentDrawerLeft>
// 	);
// }
