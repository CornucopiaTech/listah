import Typography from '@mui/material/Typography';


export default function HeroTypography(props) {
	return (
		<Typography variant="h5"
					component="div" gutterBottom
					sx={{ color: 'text.secondary',
							textAlign: 'center',
							justifyContent: 'center',
							// justifyContent:'space-evenly',
							letterSpacing: 1,
							// pt: 6, px: 4
						}}>
			{props.content}
		</Typography>
	);
}
