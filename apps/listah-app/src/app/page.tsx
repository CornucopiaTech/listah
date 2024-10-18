import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import styles from "./page.module.css";
import PersistentDrawerLeft from "@/components/Drawer/PersistentDrawer";
import HomeCard from "@/app/home/HomeCard";
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import HeroTypography from '@/components/Typography/Hero';


export default function Home() {
	return (
		<PersistentDrawerLeft>
			<ResponsiveGrid>
				<div className={styles.page}>
					<main className={styles.main}>
						<Box sx={{ bgcolor: '#cfe8fc', height: '100%' }}>
							<HeroTypography content='Which list would you like' />
							<HomeCard />
						</Box>
					</main>
					<footer className={styles.footer}></footer>
				</div>
			</ResponsiveGrid>
		</PersistentDrawerLeft>
	);
}
