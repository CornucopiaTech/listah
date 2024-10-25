import Box from '@mui/material/Box';

import styles from "./page.module.css";
import HomeCard from "@/app/home/HomeCard";
import ResponsiveGrid from '@/components/Grid/Responsive';
import HeroTypography from '@/components/Typography/Hero';
import SimpleContainer from '@/components/Container/FluidContainer';
import MainDrawer from '@/components/NavBar/MainDrawer';


export default function Home() {

	return (
		<SimpleContainer>
			< MainDrawer>
				<ResponsiveGrid style={{flexGrow: 1,
										justifyContent: 'space-evenly',
										alignItems: 'center', flexWrap: 'wrap',
										p: { xs: 4, md: 6 },
										height: '100%',
										width: '100%', bgcolor: '#cfffff'}}
								spacing={{ xs: 2, md: 3 }}
								columns={{ xs: 4, sm: 8, md: 12 }}>
				<Box sx={{flexGrow: 1,
							justifyContent: 'space-evenly', display: 'inline',
							alignItems: 'center', flexWrap: 'wrap',
							mt: { xs: 4, md: 6 }, height: '100%',
							width: '100%', bgcolor: '#efffff'}}>

						<HeroTypography content='Which list would you like?' />
				</Box>

				<Box sx={{
							flexGrow: 1, justifyContent: 'space-evenly', display: 'flex',
							alignItems: 'center', flexWrap: 'wrap', p: { xs: 2, md: 3 },
							height: '100%', width: '100%', bgcolor: '#cfffff'
						}}>
					<HomeCard/>
				</Box>
				</ResponsiveGrid>
			</ MainDrawer>
		</SimpleContainer>

	);
}
