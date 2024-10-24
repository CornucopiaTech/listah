
import Grid from '@mui/material/Grid2';


export default function BasicGrid(props) {
  return (
	<Grid size={props.gridHeight}>
		{ props.children }
	</Grid>
  );
}
