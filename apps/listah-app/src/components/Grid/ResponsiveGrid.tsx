import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';



export default function ResponsiveGrid({ children }) {
	return (
	  <Box sx={{ flexGrow: 1, justifyContent: 'center', mx: { xs: 2, sm: 8, md: 12 }, my: { xs: 2, sm: 8, md: 12 },  height: '100%', width: '100%'}}>
		<Grid container
			  spacing={{ xs: 2, md: 3 }}
			  columns={{ xs: 4, sm: 8, md: 12 }}
		>
		  { children }
		</Grid>
	  </Box>
	);
  }
