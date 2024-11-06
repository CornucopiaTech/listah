import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';



// export default function ResponsiveGrid(props, { children }) {
export default function ResponsiveGrid(props) {
	return (
		<Box sx={props.style}>
			<Grid container
				spacing={props.spacing}
				columns={props.columns}>
				{ props.children }
			</Grid>
		</Box>
	);
  }
