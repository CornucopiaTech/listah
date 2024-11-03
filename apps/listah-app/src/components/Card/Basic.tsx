
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


import CardButton from '../Button/Card';
import { CardHeadingTypography, CardContentTypography } from '../Typography/Card';


export default function BasicCard(props) {
  const cardActions = props.cardActions.map((item) => (
		<CardButton key={item} label={item} />
	));

  return (
    <Card sx={props.style}>
      <CardContent>
        <CardHeadingTypography content={props.cardHeading} />
        <CardContentTypography content={props.cardContent} />
      </CardContent>
      <CardActions>{cardActions}</CardActions>
    </Card>
  );
}
