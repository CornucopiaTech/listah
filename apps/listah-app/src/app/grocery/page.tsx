'use client'

import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from "../page.module.css";
import PersistentDrawerLeft from "@/components/Drawer/PersistentDrawer";
import CardContent from '@mui/material/CardContent';
import HomeCard from "@/app/home/HomeCard";
import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import HeroTypography from '@/components/Typography/Hero';
import ResponsiveDrawer from '@/components/Drawer/ResponsiveDrawer';
import Collapse from '@mui/material/Collapse';
import ComplexInteraction from '@/components/Card/ComplexInteraction';


export default function Home() {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
	  setExpanded(!expanded);
	};

	return (
		<ResponsiveDrawer>
			<ResponsiveGrid>
				<div className={styles.page}>
					<main className={styles.main}>
						<Box sx={{ bgcolor: '#cfe8fc', height: '100%',
						     justifyContent: 'center',
							 }}>
							<HeroTypography content='Which list would you like' />
							<HomeCard />
						</Box>

						<ComplexInteraction />
					</main>


					<footer className={styles.footer}></footer>
				</div>

			</ResponsiveGrid>
		</ResponsiveDrawer>
	);
}
