import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

// const Item = styled(Paper)(({ theme }) => ({
// 	backgroundColor: '#fff',
// 	...theme.typography.body2,
// 	padding: theme.spacing(2),
// 	textAlign: 'center',
// 	color: theme.palette.text.secondary,
// 	...theme.applyStyles('dark', {
// 	  backgroundColor: '#1A2027',
// 	}),
//   }));


export default function ResponsiveGrid({ children }) {
	return (
	  <Box sx={{ flexGrow: 1, m: 2, height: '100%'}}>
		<Grid container
			  spacing={{ xs: 2, md: 3 }}
			  columns={{ xs: 4, sm: 8, md: 12 }}>
		  { children }
		</Grid>
	  </Box>
	);
  }
