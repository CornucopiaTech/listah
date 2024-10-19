import Typography from '@mui/material/Typography';


export function CardHeadingTypography(props) {
	return (
		<Typography variant="h5"
					component="div" gutterBottom
					sx={{ color: 'text.secondary',
							textAlign: 'center',
							letterSpacing: 1,
							pt: 1, px: 4}}>
			{props.content}
		</Typography>
	);
}

export function CardContentTypography(props) {
	return (
		<Typography variant="body2"
					sx={{ color: 'text.secondary' }}
		>
			{props.content}
		</Typography>
	);
}
