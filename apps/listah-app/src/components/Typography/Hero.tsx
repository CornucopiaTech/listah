import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export default function HeroTypography(props) {
	return (
		<Typography variant="h3"
					component="div" gutterBottom
					sx={{ color: 'text.secondary',
							textAlign: 'center',
							justifyContent: 'center',
							letterSpacing: 1,
						}}>
			{props.content}
		</Typography>


	);
}
